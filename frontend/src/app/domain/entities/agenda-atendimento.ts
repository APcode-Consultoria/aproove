/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */

// Não é entidade: é a expansão das contratações em aberto no período consultado, sem
// tabela por trás. `data` e os horários chegam como texto ISO ('2026-09-02', '08:00').
export class AgendaAtendimento {

  data!: string;
  horario!: string;
  // Derivado no backend somando a duração do serviço ao início. Vem nulo quando falta
  // um dos dois, e aí a tela mostra só o horário de início.
  horarioFim!: string;
  idPaciente!: number;
  paciente!: string;
  servico!: string;
  responsavel!: string;

}
