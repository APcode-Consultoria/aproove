/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 18:33:08 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.enums;

import java.time.DayOfWeek;

/**
 * Dia da semana escolhido na frequência de um serviço {@link Periodicidade#SEMANAL}.
 *
 * <p>Não é coluna própria: as constantes são gravadas pelo <b>nome</b> dentro da coluna
 * {@code frequencia} de {@link com.github.andrepenteado.roove.domain.entities.ServicoContratado},
 * separadas por ponto e vírgula. Gravar o nome, e não um inteiro, deixa a coluna
 * legível e desliga o significado do valor de qualquer convenção de índice — o
 * {@code Date.getDay()} do JavaScript começa no domingo e o {@code java.time} na
 * segunda, e era essa diferença que exigia conversão nas duas pontas.</p>
 */
public enum DiaSemana {

    DOMINGO("Domingo", DayOfWeek.SUNDAY),
    SEGUNDA("Segunda-feira", DayOfWeek.MONDAY),
    TERCA("Terça-feira", DayOfWeek.TUESDAY),
    QUARTA("Quarta-feira", DayOfWeek.WEDNESDAY),
    QUINTA("Quinta-feira", DayOfWeek.THURSDAY),
    SEXTA("Sexta-feira", DayOfWeek.FRIDAY),
    SABADO("Sábado", DayOfWeek.SATURDAY);

    private final String descricao;

    private final DayOfWeek dayOfWeek;

    DiaSemana(String descricao, DayOfWeek dayOfWeek) {
        this.descricao = descricao;
        this.dayOfWeek = dayOfWeek;
    }

    /**
     * Texto exibido na interface para a constante.
     *
     * @return descrição do dia da semana.
     */
    public String getDescricao() {
        return descricao;
    }

    /**
     * Dia da semana correspondente no {@code java.time}, usado para varrer o período na
     * montagem da agenda.
     *
     * @return constante equivalente de {@link DayOfWeek}.
     */
    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

}
