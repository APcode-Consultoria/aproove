/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.filter;

import com.github.andrepenteado.roove.domain.entities.QPagamento;
import com.querydsl.core.BooleanBuilder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

/**
 * Filtro da tela de pagamentos.
 *
 * <p>Duas partes combinadas com AND: a situação — os três switches, que se somam entre
 * si com OR — e o período de vencimento.</p>
 */
@Getter
@Setter
@ToString
public class PagamentoFilter {

    /** Data de pagamento preenchida. */
    private Boolean pagos;

    /** Em aberto e com vencimento já passado. */
    private Boolean vencidos;

    /** Em aberto e com vencimento de hoje em diante. */
    private Boolean aVencer;

    private LocalDate inicio;

    private LocalDate fim;

    /**
     * Converte o filtro em predicado QueryDSL.
     *
     * @return predicado da pesquisa, sem nenhuma condição quando nada foi informado.
     */
    public BooleanBuilder toPredicate() {
        QPagamento pagamento = QPagamento.pagamento;
        BooleanBuilder predicado = new BooleanBuilder();

        // Os três switches são alternativas da mesma pergunta ("em que situação está?"),
        // então somam com OR entre si. Nenhum marcado significa sem filtro de situação.
        BooleanBuilder situacao = new BooleanBuilder();
        LocalDate hoje = LocalDate.now();

        if (marcado(pagos))
            situacao.or(pagamento.dataPagamento.isNotNull());

        if (marcado(vencidos))
            situacao.or(pagamento.dataPagamento.isNull().and(pagamento.dataVencimento.before(hoje)));

        // Hoje conta como "a vencer": ainda não está atrasado. Sem isso, o vencimento de
        // hoje não apareceria em switch nenhum.
        if (marcado(aVencer))
            situacao.or(pagamento.dataPagamento.isNull().and(pagamento.dataVencimento.goe(hoje)));

        if (situacao.hasValue())
            predicado.and(situacao);

        if (inicio != null)
            predicado.and(pagamento.dataVencimento.goe(inicio));

        if (fim != null)
            predicado.and(pagamento.dataVencimento.loe(fim));

        return predicado;
    }

    /**
     * Verifica se um switch do filtro está ligado.
     *
     * @param valor valor do switch.
     * @return {@code true} apenas quando explicitamente marcado.
     */
    private boolean marcado(Boolean valor) {
        return Boolean.TRUE.equals(valor);
    }

}
