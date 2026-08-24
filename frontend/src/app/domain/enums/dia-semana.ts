/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */

// Dias da semana da frequência semanal. O inteiro e a ordem são os do
// `Date.getDay()` do JavaScript: 0 = domingo. É esse inteiro que vai gravado na
// coluna `frequencia`, não o texto.
export const DIAS_SEMANA: { valor: number; label: string }[] = [
  { valor: 0, label: 'Domingo' },
  { valor: 1, label: 'Segunda-feira' },
  { valor: 2, label: 'Terça-feira' },
  { valor: 3, label: 'Quarta-feira' },
  { valor: 4, label: 'Quinta-feira' },
  { valor: 5, label: 'Sexta-feira' },
  { valor: 6, label: 'Sábado' }
];

export const DIA_SEMANA_LABELS: Record<number, string> = Object.fromEntries(
  DIAS_SEMANA.map(({ valor, label }) => [valor, label])
);
