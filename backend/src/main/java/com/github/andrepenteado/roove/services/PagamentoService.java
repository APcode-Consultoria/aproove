/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.services.SecurityService;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.entities.Pagamento;
import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import com.github.andrepenteado.roove.domain.filter.PagamentoFilter;
import com.github.andrepenteado.roove.domain.repositories.PagamentoRepository;
import com.querydsl.core.BooleanBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_DIRETOR;
import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

/**
 * Regras de negócio dos pagamentos das contratações de serviço.
 *
 * <p>O pagamento nunca é criado pela tela: nasce da contratação (regra "pagamento gerado
 * ao contratar") e se renova a cada quitação enquanto a contratação estiver em aberto
 * (regra "renovação ao pagar"), ambas declaradas em .cruds/paciente.yaml.</p>
 */
@Service
@RequiredArgsConstructor
@Validated
@Slf4j
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;

    private final PacienteService pacienteService;

    private final SecurityService securityService;

    /**
     * Lista os pagamentos de um paciente.
     *
     * <p>Passa pelo {@code PacienteService.buscar} de propósito: é ele que aplica a
     * regra de visibilidade por responsável.</p>
     *
     * @param idPaciente identificador do paciente.
     * @return pagamentos do paciente, do vencimento mais recente para o mais antigo.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public List<Pagamento> listarPorPaciente(Long idPaciente) {
        Paciente paciente = pacienteService.buscar(idPaciente);
        return pagamentoRepository.findByPacienteIdOrderByDataVencimentoDesc(paciente.getId());
    }

    /**
     * Lista todos os pagamentos, do vencimento mais recente para o mais antigo.
     *
     * <p>Alimenta a tela de pagamentos do menu, exclusiva do DIRETOR — a aba do paciente
     * usa {@link #listarPorPaciente(Long)}.</p>
     *
     * @return todos os pagamentos.
     */
    @Secured(PERFIL_DIRETOR)
    public List<Pagamento> listar() {
        return pagamentoRepository.findAll(Sort.by(Sort.Direction.DESC, "dataVencimento"));
    }

    /**
     * Pesquisa pagamentos pelos critérios da tela.
     *
     * @param filtro situação e período de vencimento.
     * @return pagamentos que atendem ao filtro; sem nenhum critério, a lista completa.
     */
    @Secured(PERFIL_DIRETOR)
    public List<Pagamento> pesquisar(PagamentoFilter filtro) {
        BooleanBuilder predicado = filtro.toPredicate();

        if (!predicado.hasValue())
            return listar();

        List<Pagamento> pagamentos = new ArrayList<>();
        pagamentoRepository.findAll(predicado, Sort.by(Sort.Direction.DESC, "dataVencimento")).forEach(pagamentos::add);
        return pagamentos;
    }

    /**
     * Busca um pagamento pela chave primária.
     *
     * @param id identificador do pagamento.
     * @return pagamento encontrado.
     * @throws ResponseStatusException 404 quando não existe pagamento com o ID.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public Pagamento buscar(Long id) {
        return pagamentoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    /**
     * Inclui um pagamento avulso.
     *
     * @param pagamento dados do pagamento.
     * @return pagamento gravado.
     * @throws ResponseStatusException 409 quando o payload traz um ID.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public Pagamento incluir(@Valid Pagamento pagamento) {
        if (Objects.nonNull(pagamento.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado incluir pagamento, porém enviado dados do pagamento ID %s", pagamento.getId()));

        return gravarNovo(pagamento);
    }

    /**
     * Altera um pagamento — é por aqui que passa a ação Pagar da aba.
     *
     * <p>Só data e valor pagos são editáveis: contratação, vencimento e valor vêm da
     * contratação e são repostos do registro existente, para a tela não conseguir
     * reescrevê-los. Ao quitar, aplica a regra "renovação ao pagar".</p>
     *
     * @param pagamento dados novos do pagamento.
     * @param id identificador do pagamento a alterar.
     * @return pagamento gravado.
     * @throws ResponseStatusException 409 quando o ID do payload não é o da URL.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public Pagamento alterar(@Valid Pagamento pagamento, Long id) {
        if (!Objects.equals(pagamento.getId(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar pagamento ID %s, porém enviado dados do pagamento %s", id, pagamento.getId()));

        Pagamento existente = buscar(id);
        boolean jaEstavaPago = existente.isPago();

        pagamento.setPaciente(existente.getPaciente());
        pagamento.setServicoContratado(existente.getServicoContratado());
        pagamento.setDataVencimento(existente.getDataVencimento());
        pagamento.setValor(existente.getValor());

        pagamento.setDataCadastro(existente.getDataCadastro());
        pagamento.setUsuarioCadastro(existente.getUsuarioCadastro());
        pagamento.setDataUltimaAtualizacao(LocalDateTime.now());
        pagamento.setUsuarioUltimaAtualizacao(securityService.getUserLogin().getLogin());

        Pagamento gravado = pagamentoRepository.save(pagamento);

        // Regra "renovação ao pagar" (.cruds/paciente.yaml). O `jaEstavaPago` evita
        // renovar de novo a cada correção de um pagamento já quitado: renova só na
        // transição de em aberto para pago.
        if (!jaEstavaPago && gravado.isPago())
            renovar(gravado);

        return gravado;
    }

    /**
     * Exclui um pagamento.
     *
     * <p>Exclusivo do DIRETOR: pagamento é histórico financeiro.</p>
     *
     * @param id identificador do pagamento a excluir.
     */
    @Secured(PERFIL_DIRETOR)
    public void excluir(Long id) {
        pagamentoRepository.deleteById(id);
    }

    /**
     * Gera o primeiro pagamento de uma contratação.
     *
     * <p>Regra "pagamento gerado ao contratar" (.cruds/paciente.yaml): vence no dia de
     * vencimento do paciente, no mês do início da contratação, <b>sem</b> adiantar para
     * o mês seguinte quando a data já passou — pode nascer vencido, e é o
     * comportamento pedido.</p>
     *
     * @param servicoContratado contratação recém-incluída.
     * @return pagamento gerado.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public Pagamento gerarPrimeiroPagamento(ServicoContratado servicoContratado) {
        Pagamento pagamento = new Pagamento();
        pagamento.setPaciente(servicoContratado.getPaciente());
        pagamento.setServicoContratado(servicoContratado);
        pagamento.setValor(servicoContratado.getValorContratado());
        pagamento.setDataVencimento(calcularVencimento(servicoContratado, servicoContratado.getInicioContratacao()));

        log.info("Gerar pagamento da contratação do serviço {}", servicoContratado.getServico().getNome());

        return gravarNovo(pagamento);
    }

    /**
     * Gera o pagamento seguinte de uma contratação ainda em aberto.
     *
     * <p>Regra "renovação ao pagar": a cobrança é mensal, independente da periodicidade
     * do serviço, porque o dia de vencimento do paciente é um dia do mês.</p>
     *
     * @param quitado pagamento que acabou de ser quitado.
     */
    private void renovar(Pagamento quitado) {
        ServicoContratado servicoContratado = quitado.getServicoContratado();

        if (Objects.nonNull(servicoContratado.getFimContratacao()))
            return;

        Pagamento proximo = new Pagamento();
        proximo.setPaciente(quitado.getPaciente());
        proximo.setServicoContratado(servicoContratado);
        proximo.setValor(servicoContratado.getValorContratado());
        proximo.setDataVencimento(calcularVencimento(servicoContratado, quitado.getDataVencimento().plusMonths(1)));

        log.info("Renovar contratação do serviço {} com novo pagamento", servicoContratado.getServico().getNome());

        gravarNovo(proximo);
    }

    /**
     * Aplica o dia de vencimento do paciente ao mês da data base.
     *
     * @param servicoContratado contratação, de onde sai o paciente.
     * @param base data cujo mês recebe o dia de vencimento.
     * @return data de vencimento, ou a própria base quando o paciente não tem dia
     *         cadastrado.
     */
    private LocalDate calcularVencimento(ServicoContratado servicoContratado, LocalDate base) {
        Integer diaVencimento = servicoContratado.getPaciente().getDiaVencimento();

        if (Objects.isNull(diaVencimento))
            return base;

        // Dia 31 em mês curto cai no último dia; valor fora de 1..31 é normalizado em
        // vez de estourar o LocalDate.
        int dia = Math.min(Math.max(diaVencimento, 1), base.lengthOfMonth());
        return base.withDayOfMonth(dia);
    }

    /**
     * Grava um pagamento novo com a auditoria de criação.
     *
     * @param pagamento pagamento a gravar.
     * @return pagamento gravado.
     */
    private Pagamento gravarNovo(Pagamento pagamento) {
        pagamento.setId(null);
        pagamento.setDataCadastro(LocalDateTime.now());
        pagamento.setUsuarioCadastro(securityService.getUserLogin().getLogin());
        return pagamentoRepository.save(pagamento);
    }

}
