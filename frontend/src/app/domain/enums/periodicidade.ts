/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */

// Cada constante tem o proprio nome como valor: o backend serializa o enum como texto
// (@Enumerated(EnumType.STRING)), entao valor numerico nao casaria com o payload.
//
// E a periodicidade que define o que cada valor da coluna `frequencia` da contratacao
// significa: datas no AVULSO, dias da semana no SEMANAL e dias do mes no MENSAL.
export enum Periodicidade {
  AVULSO = 'AVULSO',
  SEMANAL = 'SEMANAL',
  MENSAL = 'MENSAL'
}

// E este Record que alimenta grid, filtro e radio buttons: nenhuma tela escreve label
// de enum a mao.
export const PERIODICIDADE_LABELS: Record<Periodicidade, string> = {
  [Periodicidade.AVULSO]: 'Avulso (Pontual)',
  [Periodicidade.SEMANAL]: 'Semanal',
  [Periodicidade.MENSAL]: 'Mensal'
};
