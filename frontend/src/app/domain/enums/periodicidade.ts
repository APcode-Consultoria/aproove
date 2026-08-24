/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */

// Cada constante tem o proprio nome como valor: o backend serializa o enum como texto
// (@Enumerated(EnumType.STRING)), entao valor numerico nao casaria com o payload.
export enum Periodicidade {
  SEMANAL = 'SEMANAL',
  QUINZENAL = 'QUINZENAL',
  MENSAL = 'MENSAL'
}

// E este Record que alimenta grid, filtro e radio buttons: nenhuma tela escreve label
// de enum a mao.
export const PERIODICIDADE_LABELS: Record<Periodicidade, string> = {
  [Periodicidade.SEMANAL]: 'Semanal',
  [Periodicidade.QUINZENAL]: 'Quinzenal',
  [Periodicidade.MENSAL]: 'Mensal'
};
