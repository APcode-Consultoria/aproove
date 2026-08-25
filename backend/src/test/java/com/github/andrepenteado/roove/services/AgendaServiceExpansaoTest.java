package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.agenda.AgendaAtendimento;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.entities.Servico;
import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import com.github.andrepenteado.roove.domain.enums.Periodicidade;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Testes da expansão de contratações em atendimentos, o cálculo que sustenta tanto a
 * agenda quanto a regra "sem choque de horário" (.cruds/paciente.yaml).
 *
 * <p>Sem Spring e sem banco de propósito: {@code expandir} é aritmética de calendário
 * sobre os objetos recebidos, não consulta nada, e um teste que subisse o contexto
 * inteiro para exercitá-la esconderia isso.</p>
 */
public class AgendaServiceExpansaoTest {

    // Os dois colaboradores só são usados pelo `listar`, que não é o que se testa aqui.
    private final AgendaService agendaService = new AgendaService(null, null);

    private static final LocalDate SEGUNDA_04_05 = LocalDate.of(2026, 5, 4);

    private static final LocalDate DOMINGO_31_05 = LocalDate.of(2026, 5, 31);

    private ServicoContratado contratacao(Periodicidade periodicidade, String frequencia, String horarios,
                                          LocalDate inicioContratacao, LocalDate fimContratacao) {
        Paciente paciente = new Paciente();
        paciente.setId(1L);
        paciente.setNome("Paciente de Testes");
        paciente.setResponsavel("usuario.teste");

        Servico servico = new Servico();
        servico.setId(1L);
        servico.setNome("Serviço de Testes");
        servico.setDuracao(60);
        servico.setPeriodicidade(periodicidade);

        ServicoContratado contratacao = new ServicoContratado();
        contratacao.setPaciente(paciente);
        contratacao.setServico(servico);
        contratacao.setFrequencia(frequencia);
        contratacao.setHorarios(horarios);
        contratacao.setInicioContratacao(inicioContratacao);
        contratacao.setFimContratacao(fimContratacao);

        return contratacao;
    }

    private List<LocalDate> datas(List<AgendaAtendimento> atendimentos) {
        return atendimentos.stream().map(AgendaAtendimento::data).toList();
    }

    @Test
    @DisplayName("Contratação avulsa aparece nas datas dela, apesar de nascer com fim preenchido")
    void testAvulsoAparece() {
        // A regra "contratação avulsa nasce fechada" grava a primeira e a última data no
        // período da contratação: filtrar por fim nulo apagaria o avulso inteiro da
        // agenda, que foi o bug que esta expansão passou a cobrir.
        LocalDate primeira = LocalDate.of(2026, 5, 6);
        LocalDate ultima = LocalDate.of(2026, 5, 20);

        List<AgendaAtendimento> atendimentos = agendaService.expandir(
            List.of(contratacao(Periodicidade.AVULSO, "2026-05-06;2026-05-20", "08:00;08:00", primeira, ultima)),
            SEGUNDA_04_05, DOMINGO_31_05);

        assertEquals(List.of(primeira, ultima), datas(atendimentos));
    }

    @Test
    @DisplayName("Contratação encerrada não gera atendimento depois do encerramento")
    void testEncerradaParaNoFim() {
        // Toda segunda de maio, encerrada no dia 15: as segundas 18 e 25 não existem
        // mais. Sem o corte pelo fim da contratação, a expansão iria até o fim do
        // período consultado.
        List<AgendaAtendimento> atendimentos = agendaService.expandir(
            List.of(contratacao(Periodicidade.SEMANAL, "SEGUNDA", "08:00", SEGUNDA_04_05, LocalDate.of(2026, 5, 15))),
            SEGUNDA_04_05, DOMINGO_31_05);

        assertEquals(List.of(LocalDate.of(2026, 5, 4), LocalDate.of(2026, 5, 11)), datas(atendimentos));
    }

    @Test
    @DisplayName("Contratação em aberto gera atendimento até o fim do período consultado")
    void testEmAbertoVaiAteOFim() {
        List<AgendaAtendimento> atendimentos = agendaService.expandir(
            List.of(contratacao(Periodicidade.SEMANAL, "SEGUNDA", "08:00", SEGUNDA_04_05, null)),
            SEGUNDA_04_05, DOMINGO_31_05);

        assertEquals(
            List.of(LocalDate.of(2026, 5, 4), LocalDate.of(2026, 5, 11), LocalDate.of(2026, 5, 18), LocalDate.of(2026, 5, 25)),
            datas(atendimentos));
    }

    @Test
    @DisplayName("Contratação não gera atendimento antes do início dela")
    void testNaoComecaAntesDaContratacao() {
        List<AgendaAtendimento> atendimentos = agendaService.expandir(
            List.of(contratacao(Periodicidade.SEMANAL, "SEGUNDA", "08:00", LocalDate.of(2026, 5, 12), null)),
            SEGUNDA_04_05, DOMINGO_31_05);

        assertEquals(List.of(LocalDate.of(2026, 5, 18), LocalDate.of(2026, 5, 25)), datas(atendimentos));
    }

    @Test
    @DisplayName("Contratação encerrada antes do período não gera atendimento nenhum")
    void testEncerradaAntesDoPeriodo() {
        List<AgendaAtendimento> atendimentos = agendaService.expandir(
            List.of(contratacao(Periodicidade.SEMANAL, "SEGUNDA", "08:00", LocalDate.of(2026, 1, 5), LocalDate.of(2026, 4, 30))),
            SEGUNDA_04_05, DOMINGO_31_05);

        assertTrue(atendimentos.isEmpty(), () -> "esperado vazio, veio " + datas(atendimentos));
    }

    @Test
    @DisplayName("Horário final sai da duração do serviço somada ao início")
    void testHorarioFimDerivado() {
        List<AgendaAtendimento> atendimentos = agendaService.expandir(
            List.of(contratacao(Periodicidade.SEMANAL, "SEGUNDA", "08:00", SEGUNDA_04_05, LocalDate.of(2026, 5, 4))),
            SEGUNDA_04_05, DOMINGO_31_05);

        assertEquals(1, atendimentos.size());
        assertEquals(LocalTime.of(8, 0), atendimentos.getFirst().horario());
        assertEquals(LocalTime.of(9, 0), atendimentos.getFirst().horarioFim());
    }

}
