/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.filter;

import com.github.andrepenteado.roove.domain.entities.QServico;
import com.github.andrepenteado.roove.domain.enums.Periodicidade;
import com.querydsl.core.BooleanBuilder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Filtro de pesquisa de Serviço.
 *
 * <p>O nome é `pesquisavel: contem` — busca parcial, sem diferenciar maiúsculas de
 * minúsculas — e a periodicidade é `pesquisavel: exato`, por igualdade. Campos nulos,
 * em branco ou com enum não selecionado são ignorados, e os critérios informados são
 * combinados com AND.</p>
 */
@Getter
@Setter
@ToString
public class ServicoFilter {

    private String nome;

    private Periodicidade periodicidade;

    /**
     * Converte o filtro em predicado QueryDSL.
     *
     * @return predicado da pesquisa, sem nenhuma condição quando nada foi informado.
     */
    public BooleanBuilder toPredicate() {
        QServico servico = QServico.servico;
        BooleanBuilder predicado = new BooleanBuilder();

        if (preenchido(nome))
            predicado.and(servico.nome.containsIgnoreCase(nome.trim()));

        if (periodicidade != null)
            predicado.and(servico.periodicidade.eq(periodicidade));

        return predicado;
    }

    /**
     * Verifica se um valor do filtro foi informado.
     *
     * @param valor valor a verificar.
     * @return {@code true} quando o valor não é nulo nem está em branco.
     */
    private boolean preenchido(String valor) {
        return valor != null && !valor.isBlank();
    }

}
