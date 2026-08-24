/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.repositories;

import com.github.andrepenteado.roove.domain.entities.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório de {@link Servico}.
 *
 * <p>Estende {@code QuerydslPredicateExecutor} para o {@code /servicos/pesquisar}
 * poder executar o predicado montado pelo
 * {@link com.github.andrepenteado.roove.domain.filter.ServicoFilter}.</p>
 */
@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long>, QuerydslPredicateExecutor<Servico> {

    /**
     * Lista todos os serviços em ordem alfabética.
     *
     * @return serviços ordenados pelo nome.
     */
    List<Servico> findAllByOrderByNomeAsc();

}
