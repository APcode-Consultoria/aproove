/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.repositories;

import com.github.andrepenteado.roove.domain.entities.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório de {@link Pagamento}.
 *
 * <p>Estende {@code QuerydslPredicateExecutor} para a tela de pagamentos executar o
 * predicado montado pelo
 * {@link com.github.andrepenteado.roove.domain.filter.PagamentoFilter}.</p>
 */
@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long>, QuerydslPredicateExecutor<Pagamento> {

    /**
     * Lista os pagamentos de um paciente, do vencimento mais recente para o mais antigo.
     *
     * @param id identificador do paciente.
     * @return pagamentos do paciente.
     */
    List<Pagamento> findByPacienteIdOrderByDataVencimentoDesc(Long id);

}
