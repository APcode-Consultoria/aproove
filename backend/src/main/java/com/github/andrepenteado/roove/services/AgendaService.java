/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.services.SecurityService;
import com.github.andrepenteado.roove.domain.agenda.AgendaAtendimento;
import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import com.github.andrepenteado.roove.domain.enums.DiaSemana;
import com.github.andrepenteado.roove.domain.enums.Periodicidade;
import com.github.andrepenteado.roove.domain.repositories.ServicoContratadoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_DIRETOR;
import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

/**
 * Agenda de atendimentos de um fisioterapeuta.
 *
 * <p>Não há tabela de agenda: os atendimentos são <b>derivados</b> das contratações em
 * aberto dos pacientes sob responsabilidade dele, expandindo a frequência de cada uma
 * dentro do período consultado. Como cada valor da coluna {@code frequencia} significa
 * uma coisa diferente conforme a {@link Periodicidade} do serviço, a expansão tem um
 * caminho por periodicidade.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgendaService {

    private final ServicoContratadoRepository servicoContratadoRepository;

    private final SecurityService securityService;

    /**
     * Monta a agenda de um fisioterapeuta no período informado.
     *
     * <p>Só o DIRETOR consulta a agenda de outra pessoa: para os demais o responsável é
     * forçado para o próprio login, independente do que veio na requisição. Esconder o
     * campo na tela não seria barreira.</p>
     *
     * @param responsavel login do fisioterapeuta; vazio assume o usuário logado.
     * @param inicio primeiro dia do período.
     * @param fim último dia do período.
     * @return atendimentos ordenados por data e horário.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public List<AgendaAtendimento> listar(String responsavel, LocalDate inicio, LocalDate fim) {
        String login = securityService.getUserLogin().getLogin();
        String alvo = securityService.hasPerfil(PERFIL_DIRETOR) && Objects.nonNull(responsavel) && !responsavel.isBlank()
            ? responsavel.trim()
            : login;

        log.info("Montar agenda de {} entre {} e {}", alvo, inicio, fim);

        List<AgendaAtendimento> atendimentos = new ArrayList<>();
        for (ServicoContratado contratacao : servicoContratadoRepository.findByFimContratacaoIsNullAndPacienteResponsavel(alvo)) {
            expandir(contratacao, inicio, fim, atendimentos);
        }

        atendimentos.sort(
            Comparator.comparing(AgendaAtendimento::data)
                .thenComparing(AgendaAtendimento::horario, Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(AgendaAtendimento::paciente)
        );
        return atendimentos;
    }

    /**
     * Expande uma contratação nas ocorrências que caem no período.
     *
     * @param contratacao contratação em aberto.
     * @param inicio primeiro dia do período.
     * @param fim último dia do período.
     * @param destino lista que recebe as ocorrências.
     */
    private void expandir(ServicoContratado contratacao, LocalDate inicio, LocalDate fim, List<AgendaAtendimento> destino) {
        if (Objects.isNull(contratacao.getFrequencia()) || contratacao.getFrequencia().isBlank())
            return;

        Periodicidade periodicidade = contratacao.getServico().getPeriodicidade();
        if (Objects.isNull(periodicidade))
            // Servico sem periodicidade nao diz o que os valores da frequencia
            // significam, entao nao ha como derivar atendimento nenhum.
            return;

        String[] valores = contratacao.getFrequencia().split(";");
        String[] horarios = Objects.isNull(contratacao.getHorarios()) ? new String[0] : contratacao.getHorarios().split(";");

        // Nunca antes do início da contratação, mesmo que o período consultado alcance.
        LocalDate primeiroDia = contratacao.getInicioContratacao().isAfter(inicio)
            ? contratacao.getInicioContratacao()
            : inicio;

        for (int i = 0; i < valores.length; i++) {
            LocalTime horario = paraHorario(i < horarios.length ? horarios[i] : null);

            switch (periodicidade) {
                case AVULSO -> expandirAvulso(contratacao, valores[i], horario, primeiroDia, fim, destino);
                case SEMANAL -> expandirSemanal(contratacao, valores[i], horario, primeiroDia, fim, destino);
                case MENSAL -> expandirMensal(contratacao, valores[i], horario, primeiroDia, fim, destino);
            }
        }
    }

    /**
     * Ocorrência única, na data gravada. Sem recorrência: é o que distingue o
     * {@link Periodicidade#AVULSO} das demais periodicidades.
     *
     * @param contratacao contratação de origem.
     * @param valor data do atendimento, em ISO, como gravada na frequência.
     * @param horario horário de início do atendimento.
     * @param inicio primeiro dia considerado.
     * @param fim último dia do período.
     * @param destino lista que recebe a ocorrência.
     */
    private void expandirAvulso(ServicoContratado contratacao, String valor, LocalTime horario, LocalDate inicio, LocalDate fim, List<AgendaAtendimento> destino) {
        LocalDate data = paraData(valor);
        if (Objects.isNull(data))
            return;

        if (!data.isBefore(inicio) && !data.isAfter(fim))
            destino.add(montar(contratacao, data, horario));
    }

    /**
     * Uma ocorrência por semana, no dia da semana gravado.
     *
     * @param contratacao contratação de origem.
     * @param valor nome da constante de {@link DiaSemana} gravada na frequência.
     * @param horario horário de início do atendimento.
     * @param inicio primeiro dia considerado.
     * @param fim último dia do período.
     * @param destino lista que recebe as ocorrências.
     */
    private void expandirSemanal(ServicoContratado contratacao, String valor, LocalTime horario, LocalDate inicio, LocalDate fim, List<AgendaAtendimento> destino) {
        DiaSemana diaSemana = paraDiaSemana(valor);
        if (Objects.isNull(diaSemana))
            return;

        for (LocalDate data = inicio; !data.isAfter(fim); data = data.plusDays(1)) {
            if (data.getDayOfWeek() == diaSemana.getDayOfWeek())
                destino.add(montar(contratacao, data, horario));
        }
    }

    /**
     * Uma ocorrência por mês, no dia do mês gravado.
     *
     * @param contratacao contratação de origem.
     * @param valor dia do mês (1 a 31) gravado na frequência.
     * @param horario horário de início do atendimento.
     * @param inicio primeiro dia considerado.
     * @param fim último dia do período.
     * @param destino lista que recebe as ocorrências.
     */
    private void expandirMensal(ServicoContratado contratacao, String valor, LocalTime horario, LocalDate inicio, LocalDate fim, List<AgendaAtendimento> destino) {
        Integer diaMes = paraInteiro(valor);
        if (Objects.isNull(diaMes) || diaMes < 1)
            return;

        LocalDate mes = inicio.withDayOfMonth(1);

        while (!mes.isAfter(fim)) {
            // Dia 31 em mês curto cai no último dia, mesma regra do vencimento.
            LocalDate data = mes.withDayOfMonth(Math.min(diaMes, mes.lengthOfMonth()));

            if (!data.isBefore(inicio) && !data.isAfter(fim))
                destino.add(montar(contratacao, data, horario));

            mes = mes.plusMonths(1);
        }
    }

    /**
     * Monta a ocorrência a partir da contratação, derivando o término do atendimento.
     *
     * @param contratacao contratação de origem.
     * @param data dia do atendimento.
     * @param horario horário de início do atendimento.
     * @return ocorrência da agenda.
     */
    private AgendaAtendimento montar(ServicoContratado contratacao, LocalDate data, LocalTime horario) {
        return new AgendaAtendimento(
            data,
            horario,
            calcularHorarioFim(horario, contratacao.getServico().getDuracao()),
            contratacao.getPaciente().getId(),
            contratacao.getPaciente().getNome(),
            contratacao.getServico().getNome(),
            contratacao.getPaciente().getResponsavel()
        );
    }

    /**
     * Soma a duração do serviço ao horário de início.
     *
     * @param horario horário de início; nulo devolve nulo.
     * @param duracao duração do serviço em minutos; nula ou não positiva devolve nulo.
     * @return horário de término, ou {@code null} quando não há como derivá-lo. Preferir
     *         nulo a devolver o próprio início: a tela sabe mostrar só o começo, mas um
     *         término igual ao início seria informação errada.
     */
    private LocalTime calcularHorarioFim(LocalTime horario, Integer duracao) {
        if (Objects.isNull(horario) || Objects.isNull(duracao) || duracao <= 0)
            return null;

        return horario.plusMinutes(duracao);
    }

    /**
     * Converte um valor da coluna de frequência em dia da semana.
     *
     * @param valor valor lido da coluna.
     * @return a constante, ou {@code null} quando o valor não é um nome de
     *         {@link DiaSemana}.
     */
    private DiaSemana paraDiaSemana(String valor) {
        try {
            return DiaSemana.valueOf(valor.trim().toUpperCase());
        }
        catch (IllegalArgumentException e) {
            return null;
        }
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
     * Converte um valor da coluna de frequência em inteiro.
     *
     * @param valor valor lido da coluna.
     * @return o inteiro, ou {@code null} quando o valor não é numérico.
     */
    private Integer paraInteiro(String valor) {
        try {
            return Integer.parseInt(valor.trim());
        }
        catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * Converte um valor da coluna de horários em hora.
     *
     * @param valor valor lido da coluna.
     * @return a hora, ou {@code null} quando vazio ou fora do formato. Contratação sem
     *         horário registrado simplesmente não tem hora.
     */
    private LocalTime paraHorario(String valor) {
        if (Objects.isNull(valor) || valor.isBlank())
            return null;

        try {
            return LocalTime.parse(valor.trim());
        }
        catch (DateTimeParseException e) {
            return null;
        }
    }

}
