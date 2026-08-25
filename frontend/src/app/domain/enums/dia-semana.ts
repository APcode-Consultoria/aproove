/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */

// Dias da semana da frequência semanal. Cada constante tem o próprio nome como valor,
// como nos demais enums: é o nome que vai gravado na coluna `frequencia` da contratação,
// não um índice.
//
// Gravar o nome desliga o significado do valor de qualquer convenção de índice — o
// `Date.getDay()` do JavaScript começa no domingo e o `java.time` na segunda, e era
// essa diferença que exigia conversão nas duas pontas.
export enum DiaSemana {
  DOMINGO = 'DOMINGO',
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO'
}

export const DIA_SEMANA_LABELS: Record<DiaSemana, string> = {
  [DiaSemana.DOMINGO]: 'Domingo',
  [DiaSemana.SEGUNDA]: 'Segunda-feira',
  [DiaSemana.TERCA]: 'Terça-feira',
  [DiaSemana.QUARTA]: 'Quarta-feira',
  [DiaSemana.QUINTA]: 'Quinta-feira',
  [DiaSemana.SEXTA]: 'Sexta-feira',
  [DiaSemana.SABADO]: 'Sábado'
};

// Ordem de exibição no combo, do domingo ao sábado. `Object.values` já devolveria nesta
// ordem, mas depender da ordem de declaração do enum deixaria o combo refém de um
// detalhe do arquivo.
export const DIAS_SEMANA: DiaSemana[] = [
  DiaSemana.DOMINGO,
  DiaSemana.SEGUNDA,
  DiaSemana.TERCA,
  DiaSemana.QUARTA,
  DiaSemana.QUINTA,
  DiaSemana.SEXTA,
  DiaSemana.SABADO
];
