/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.agenda;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Uma ocorrência de atendimento na agenda de um fisioterapeuta.
 *
 * <p>Não é entidade e não tem tabela: é a expansão, no período consultado, das
 * contratações do fisioterapeuta vigentes nele. Por isso é um {@code record}, e não um
 * objeto de domínio — a regra do projeto de não criar DTO vale para os CRUDs, que
 * trafegam a própria entidade.</p>
 *
 * @param data dia do atendimento.
 * @param horario hora de início, nula quando a contratação não registrou horário.
 * @param horarioFim hora de término, derivada somando a duração do serviço ao início.
 *                   Nula quando falta o horário ou o serviço não tem duração — a tela
 *                   mostra só o início, em vez de inventar um término.
 * @param idPaciente identificador do paciente, para a tela linkar o cadastro.
 * @param paciente nome do paciente.
 * @param servico nome do serviço contratado.
 * @param responsavel login do fisioterapeuta responsável.
 */
public record AgendaAtendimento(
    LocalDate data,
    LocalTime horario,
    LocalTime horarioFim,
    Long idPaciente,
    String paciente,
    String servico,
    String responsavel
) {
}
