/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.services.SecurityService;
import com.github.andrepenteado.roove.domain.agenda.AgendaAtendimento;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.entities.Servico;
import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import com.github.andrepenteado.roove.domain.enums.Periodicidade;
import com.github.andrepenteado.roove.domain.repositories.ServicoContratadoRepository;
import com.github.andrepenteado.roove.domain.repositories.ServicoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_DIRETOR;
import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

/**
 * Regras de negócio dos serviços contratados por um paciente.
 *
 * <p>Os {@code @Secured} vêm de {@code lista.acoes} em .cruds/paciente.yaml: os dois
 * perfis consultam, contratam e encerram, e só o DIRETOR exclui — excluir apaga
 * histórico de contratação.</p>
 */
@Service
@RequiredArgsConstructor
@Validated
@Slf4j
public class ServicoContratadoService {

    private final ServicoContratadoRepository servicoContratadoRepository;

    private final PacienteService pacienteService;

    // Repositório direto, e não o ServicoService: `ServicoService.buscar` é @Secured
    // só para o DIRETOR, e o FISIOTERAPEUTA também contrata. O que se quer aqui é a
    // duração e a periodicidade como estão gravadas, não as regras do CRUD de serviço.
    private final ServicoRepository servicoRepository;

    private final PagamentoService pagamentoService;

    private final AgendaService agendaService;

    private final SecurityService securityService;

    /**
     * Até onde a regra "sem choque de horário" olha, a partir do início da contratação.
     *
     * <p>Contratação SEMANAL ou MENSAL em aberto se repete sem data para acabar, e não
     * há como verificar até o infinito. Um ano cobre toda repetição semanal e toda
     * repetição mensal do primeiro ciclo de cada uma, que é o horizonte com que a
     * clínica agenda; o que estiver além só será checado quando a contratação de lá for
     * feita.</p>
     */
    private static final int MESES_VERIFICADOS_ADIANTE = 12;

    /** Data e hora nas mensagens de erro saem no formato que o usuário lê na tela. */
    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static final DateTimeFormatter FORMATO_HORA = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Lista as contratações de um paciente.
     *
     * <p>Passa pelo {@code PacienteService.buscar} de propósito: é ele que aplica a
     * regra de visibilidade por responsável, e a coleção não pode contorná-la.</p>
     *
     * @param idPaciente identificador do paciente.
     * @return contratações do paciente, da mais recente para a mais antiga.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public List<ServicoContratado> listarPorPaciente(Long idPaciente) {
        Paciente paciente = pacienteService.buscar(idPaciente);
        return servicoContratadoRepository.findByPacienteIdOrderByInicioContratacaoDesc(paciente.getId());
    }

    /**
     * Busca uma contratação pela chave primária.
     *
     * @param id identificador da contratação.
     * @return contratação encontrada.
     * @throws ResponseStatusException 404 quando não existe contratação com o ID.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado buscar(Long id) {
        return servicoContratadoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    /**
     * Inclui uma nova contratação, preenchendo a auditoria de criação.
     *
     * @param servicoContratado dados da contratação.
     * @return contratação gravada, já com o ID gerado.
     * @throws ResponseStatusException 409 quando o payload traz um ID (não é inclusão);
     *         422 quando algum horário choca com a agenda do fisioterapeuta.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado incluir(@Valid ServicoContratado servicoContratado) {
        if (Objects.nonNull(servicoContratado.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado incluir serviço contratado, porém enviado dados do serviço contratado ID %s", servicoContratado.getId()));

        // Regra "valor contratado só pelo diretor" (.cruds/paciente.yaml): na inclusão,
        // o valor enviado por quem não é diretor é descartado e a contratação nasce sem
        // valor, para o diretor preencher depois.
        if (!securityService.hasPerfil(PERFIL_DIRETOR))
            servicoContratado.setValorContratado(null);

        fecharPeriodoAvulso(servicoContratado);
        verificarChoqueDeHorario(servicoContratado);

        servicoContratado.setDataCadastro(LocalDateTime.now());
        servicoContratado.setUsuarioCadastro(securityService.getUserLogin().getLogin());

        ServicoContratado gravado = servicoContratadoRepository.save(servicoContratado);

        // Regra "pagamento gerado ao contratar" (.cruds/paciente.yaml): a contratação
        // já nasce com a primeira cobrança em aberto.
        pagamentoService.gerarPrimeiroPagamento(gravado);

        return gravado;
    }

    /**
     * Altera uma contratação, preservando a auditoria de criação.
     *
     * @param servicoContratado dados novos da contratação.
     * @param id identificador da contratação a alterar.
     * @return contratação gravada.
     * @throws ResponseStatusException 409 quando o ID do payload não é o da URL; 422
     *         quando algum horário choca com a agenda do fisioterapeuta.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado alterar(@Valid ServicoContratado servicoContratado, Long id) {
        if (!Objects.equals(servicoContratado.getId(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar serviço contratado ID %s, porém enviado dados do serviço contratado %s", id, servicoContratado.getId()));

        ServicoContratado existente = buscar(id);

        // Regra "valor contratado só pelo diretor" (.cruds/paciente.yaml): quem não é
        // diretor tem o valor recebido descartado e o do registro existente reposto.
        // Esconder o campo na tela nunca foi barreira — a barreira é esta.
        if (!securityService.hasPerfil(PERFIL_DIRETOR))
            servicoContratado.setValorContratado(existente.getValorContratado());

        fecharPeriodoAvulso(servicoContratado);
        verificarChoqueDeHorario(servicoContratado);

        servicoContratado.setDataCadastro(existente.getDataCadastro());
        servicoContratado.setUsuarioCadastro(existente.getUsuarioCadastro());

        servicoContratado.setDataUltimaAtualizacao(LocalDateTime.now());
        servicoContratado.setUsuarioUltimaAtualizacao(securityService.getUserLogin().getLogin());

        return servicoContratadoRepository.save(servicoContratado);
    }

    /**
     * Encerra uma contratação, gravando hoje no fim da contratação.
     *
     * <p>Regra "encerrar contratação" declarada em .cruds/paciente.yaml. É um comando
     * sobre um registro: não recebe nenhum dado além do ID, e por isso a tela não
     * precisa abrir a contratação para edição.</p>
     *
     * @param id identificador da contratação a encerrar.
     * @return contratação já encerrada.
     * @throws ResponseStatusException 422 quando a contratação já está encerrada.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado encerrar(Long id) {
        ServicoContratado servicoContratado = buscar(id);

        if (Objects.nonNull(servicoContratado.getFimContratacao()))
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, String.format("Contratação do serviço %s já foi encerrada em %s", servicoContratado.getServico().getNome(), servicoContratado.getFimContratacao()));

        servicoContratado.setFimContratacao(LocalDate.now());
        servicoContratado.setDataUltimaAtualizacao(LocalDateTime.now());
        servicoContratado.setUsuarioUltimaAtualizacao(securityService.getUserLogin().getLogin());

        log.info("Encerrar contratação do serviço {}", servicoContratado.getServico().getNome());

        return servicoContratadoRepository.save(servicoContratado);
    }

    /**
     * Regra "sem choque de horário" (.cruds/paciente.yaml): recusa a contratação quando
     * algum atendimento dela cai sobre um atendimento que o fisioterapeuta já tem.
     *
     * <p>A verificação é feita sobre as <b>ocorrências</b>, não sobre a coluna
     * {@code frequencia}: dois valores de frequência podem significar a mesma data sem
     * se parecerem — o dia 15 de um serviço MENSAL cai numa terça-feira em alguns meses,
     * e é exatamente aí que ele choca com um SEMANAL de terça. Quem deriva as
     * ocorrências é o {@link AgendaService#expandir}, o mesmo que monta a agenda: a
     * regra e a tela precisam enxergar os mesmos atendimentos, senão a contratação seria
     * recusada por um choque que a agenda não mostra, ou aceita criando um que ela
     * mostra.</p>
     *
     * <p>Dois atendimentos chocam quando caem no mesmo dia e as faixas
     * {@code [início, fim)} se cruzam, com o fim derivado da {@code duracao} do serviço.
     * Serviço sem duração cadastrada vira um instante, e aí só o mesmo horário de início
     * é choque. Atendimento sem horário não choca com nada: a agenda o mostra como "sem
     * horário" e não há faixa que se possa afirmar ocupada.</p>
     *
     * <p>Verifica também a contratação contra ela mesma: os N controles de frequência
     * são preenchidos de uma vez, e nada impede o usuário de escolher duas terças às
     * 08:00 no mesmo serviço.</p>
     *
     * <p>Barreira de verdade da regra: a tela pode avisar antes, mas quem recusa é este
     * método.</p>
     *
     * @param servicoContratado contratação a verificar, já com o período do avulso
     *                          fechado por {@link #fecharPeriodoAvulso}.
     * @throws ResponseStatusException 422 quando há choque, com o dia, o horário e o
     *                                 paciente do atendimento que já ocupa a faixa.
     */
    private void verificarChoqueDeHorario(ServicoContratado servicoContratado) {
        // O responsável vem do banco, nunca do payload: é ele que diz de quem é a agenda
        // consultada, e a `buscar` ainda aplica a visibilidade por responsável.
        Paciente paciente = pacienteService.buscar(servicoContratado.getPaciente().getId());
        String responsavel = paciente.getResponsavel();

        // Paciente sem responsável não entra na agenda de ninguém: não há o que chocar.
        if (Objects.isNull(responsavel) || responsavel.isBlank())
            return;

        LocalDate inicio = servicoContratado.getInicioContratacao();
        if (Objects.isNull(inicio))
            return;

        LocalDate fim = inicio.plusMonths(MESES_VERIFICADOS_ADIANTE);
        if (Objects.nonNull(servicoContratado.getFimContratacao()) && servicoContratado.getFimContratacao().isBefore(fim))
            fim = servicoContratado.getFimContratacao();

        if (fim.isBefore(inicio))
            return;

        List<AgendaAtendimento> pretendidos = agendaService.expandir(List.of(paraExpansao(servicoContratado, paciente)), inicio, fim);
        if (pretendidos.isEmpty())
            return;

        verificarChoqueInterno(pretendidos);

        List<ServicoContratado> agendaDoResponsavel = servicoContratadoRepository.buscarVigentesNoPeriodo(responsavel, inicio, fim)
            .stream()
            // Na alteração a própria contratação está na agenda, e ela não choca consigo
            // mesma. Na inclusão o ID é nulo e nada é descartado.
            .filter(contratacao -> Objects.isNull(servicoContratado.getId()) || !Objects.equals(contratacao.getId(), servicoContratado.getId()))
            .toList();

        List<AgendaAtendimento> ocupados = agendaService.expandir(agendaDoResponsavel, inicio, fim);

        for (AgendaAtendimento pretendido : pretendidos) {
            for (AgendaAtendimento ocupado : ocupados) {
                if (colidem(pretendido, ocupado)) {
                    log.info("Contratação recusada por choque de horário na agenda de {} em {} às {}", responsavel, pretendido.data(), pretendido.horario());
                    throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, String.format(
                        "Choque de horário em %s às %s: o fisioterapeuta já atende %s (%s) das %s às %s",
                        FORMATO_DATA.format(pretendido.data()),
                        FORMATO_HORA.format(pretendido.horario()),
                        ocupado.paciente(),
                        ocupado.servico(),
                        FORMATO_HORA.format(ocupado.horario()),
                        FORMATO_HORA.format(fimDe(ocupado))
                    ));
                }
            }
        }
    }

    /**
     * Verifica a contratação contra ela mesma.
     *
     * @param pretendidos ocorrências derivadas da contratação sendo gravada.
     * @throws ResponseStatusException 422 quando duas ocorrências dela se sobrepõem.
     */
    private void verificarChoqueInterno(List<AgendaAtendimento> pretendidos) {
        for (int i = 0; i < pretendidos.size(); i++) {
            for (int j = i + 1; j < pretendidos.size(); j++) {
                AgendaAtendimento um = pretendidos.get(i);
                AgendaAtendimento outro = pretendidos.get(j);

                if (colidem(um, outro)) {
                    throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, String.format(
                        "Choque de horário em %s: os horários escolhidos para esta contratação se sobrepõem, das %s às %s e das %s às %s",
                        FORMATO_DATA.format(um.data()),
                        FORMATO_HORA.format(um.horario()),
                        FORMATO_HORA.format(fimDe(um)),
                        FORMATO_HORA.format(outro.horario()),
                        FORMATO_HORA.format(fimDe(outro))
                    ));
                }
            }
        }
    }

    /**
     * Cópia da contratação com paciente e serviço como estão gravados, pronta para a
     * expansão.
     *
     * <p>O payload traz os dois objetos inteiros, mas só o ID deles é persistido: o
     * resto é o que o navegador mandou. Como a duração e a periodicidade do serviço são
     * o que decide se dois atendimentos se cruzam, elas são relidas do banco — senão a
     * verificação seria feita sobre números escolhidos por quem está sendo verificado.
     * Cópia, e não o próprio objeto, para a verificação não alterar o que vai ser
     * gravado.</p>
     *
     * @param servicoContratado contratação recebida.
     * @param paciente paciente já lido do banco.
     * @return contratação equivalente, com as relações confiáveis.
     */
    private ServicoContratado paraExpansao(ServicoContratado servicoContratado, Paciente paciente) {
        ServicoContratado copia = new ServicoContratado();

        copia.setId(servicoContratado.getId());
        copia.setPaciente(paciente);
        copia.setServico(servicoRepository.findById(servicoContratado.getServico().getId()).orElse(servicoContratado.getServico()));
        copia.setInicioContratacao(servicoContratado.getInicioContratacao());
        copia.setFimContratacao(servicoContratado.getFimContratacao());
        copia.setFrequencia(servicoContratado.getFrequencia());
        copia.setHorarios(servicoContratado.getHorarios());

        return copia;
    }

    /**
     * Dois atendimentos ocupam a mesma faixa do mesmo dia.
     *
     * @param um primeiro atendimento.
     * @param outro segundo atendimento.
     * @return {@code true} quando um não pode acontecer junto com o outro.
     */
    private boolean colidem(AgendaAtendimento um, AgendaAtendimento outro) {
        if (!um.data().equals(outro.data()))
            return false;

        // Sem horário não há faixa a comparar. Melhor deixar passar do que recusar uma
        // contratação por um atendimento que a agenda mostra como "sem horário".
        if (Objects.isNull(um.horario()) || Objects.isNull(outro.horario()))
            return false;

        // Mesmo início é choque mesmo quando os dois serviços estão sem duração
        // cadastrada e as duas faixas têm tamanho zero.
        if (um.horario().equals(outro.horario()))
            return true;

        return um.horario().isBefore(fimDe(outro)) && outro.horario().isBefore(fimDe(um));
    }

    /**
     * Fim do atendimento.
     *
     * @param atendimento atendimento derivado da agenda.
     * @return o término derivado da duração do serviço; sem duração cadastrada, o
     *         próprio início — o atendimento vira um instante em vez de uma faixa.
     */
    private LocalTime fimDe(AgendaAtendimento atendimento) {
        return Objects.nonNull(atendimento.horarioFim()) ? atendimento.horarioFim() : atendimento.horario();
    }

    /**
     * Regra "contratação avulsa nasce fechada" (.cruds/paciente.yaml): no avulso não há
     * recorrência — a frequência já traz as datas exatas dos atendimentos, então o
     * período da contratação é o intervalo entre a primeira e a última.
     *
     * <p>Deixar o fim em aberto faria a contratação avulsa se comportar como
     * recorrente: ela ficaria "em vigor" para sempre e a regra "renovação ao pagar"
     * geraria uma cobrança nova a cada quitação, sem nunca parar.</p>
     *
     * <p>Vale na inclusão e na alteração: reabrir um avulso pela alteração seria o mesmo
     * problema por outra porta. A tela também deriva as duas datas, para quem contrata
     * ver o período antes de gravar, mas quem decide é este método.</p>
     *
     * @param servicoContratado contratação a fechar; alterada no lugar.
     */
    private void fecharPeriodoAvulso(ServicoContratado servicoContratado) {
        Servico servico = servicoContratado.getServico();

        if (Objects.isNull(servico) || servico.getPeriodicidade() != Periodicidade.AVULSO)
            return;

        List<LocalDate> datas = datasDaFrequencia(servicoContratado.getFrequencia());

        // Sem data nenhuma legivel nao ha periodo a derivar: preservar o que veio e
        // melhor do que apagar o inicio que a tela exigiu como obrigatorio.
        if (datas.isEmpty())
            return;

        servicoContratado.setInicioContratacao(datas.getFirst());
        servicoContratado.setFimContratacao(datas.getLast());
    }

    /**
     * Datas gravadas na frequência de uma contratação avulsa.
     *
     * @param frequencia coluna de frequência, com as datas ISO separadas por ponto e
     *                   vírgula.
     * @return datas em ordem crescente; vazia quando nenhuma pôde ser lida.
     */
    private List<LocalDate> datasDaFrequencia(String frequencia) {
        if (Objects.isNull(frequencia) || frequencia.isBlank())
            return List.of();

        return Arrays.stream(frequencia.split(";"))
            .map(this::paraData)
            .filter(Objects::nonNull)
            .sorted()
            .toList();
    }

    /**
     * Converte um valor da coluna de frequência em data.
     *
     * @param valor valor lido da coluna, em ISO.
     * @return a data, ou {@code null} quando o valor não está no formato.
     */
    private LocalDate paraData(String valor) {
        try {
            return LocalDate.parse(valor.trim());
        }
        catch (DateTimeParseException e) {
            return null;
        }
    }

    /**
     * Exclui uma contratação.
     *
     * <p>Exclusivo do DIRETOR: excluir apaga histórico, diferente de encerrar.</p>
     *
     * @param id identificador da contratação a excluir.
     */
    @Secured(PERFIL_DIRETOR)
    public void excluir(Long id) {
        servicoContratadoRepository.deleteById(id);
    }

}
