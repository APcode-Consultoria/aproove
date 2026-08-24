/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 12:57:37 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.filter;

import com.github.andrepenteado.roove.domain.entities.QPaciente;
import com.querydsl.core.BooleanBuilder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Filtro de pesquisa de Paciente.
 *
 * Todos os campos são combinados com AND e a busca é parcial, sem diferenciar
 * maiúsculas de minúsculas. Campos nulos ou em branco são ignorados.
 */
@Getter
@Setter
@ToString
public class PacienteFilter {

    private String nome;

    private String cpf;

    private String telefone;

    private String email;

    /**
     * Converte o filtro em predicado QueryDSL.
     *
     * @return predicado da pesquisa, sem nenhuma condição quando nada foi informado.
     */
    public BooleanBuilder toPredicate() {
        QPaciente paciente = QPaciente.paciente;
        BooleanBuilder predicado = new BooleanBuilder();

        if (preenchido(nome))
            predicado.and(paciente.nome.containsIgnoreCase(nome.trim()));

        // CPF e telefone são gravados só com dígitos, sem máscara. Os dígitos são
        // extraídos aqui também para o filtro funcionar caso o valor chegue mascarado.
        String digitosCpf = somenteDigitos(cpf);
        if (preenchido(digitosCpf))
            predicado.and(paciente.cpf.contains(digitosCpf));

        String digitosTelefone = somenteDigitos(telefone);
        if (preenchido(digitosTelefone))
            predicado.and(paciente.telefone.contains(digitosTelefone));

        if (preenchido(email))
            predicado.and(paciente.email.containsIgnoreCase(email.trim()));

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

    /**
     * Remove tudo que não for dígito de um valor do filtro.
     *
     * @param valor valor a limpar.
     * @return valor apenas com os dígitos, ou {@code null} quando nada foi informado.
     */
    private String somenteDigitos(String valor) {
        return valor == null ? null : valor.replaceAll("\\D", "");
    }

}
