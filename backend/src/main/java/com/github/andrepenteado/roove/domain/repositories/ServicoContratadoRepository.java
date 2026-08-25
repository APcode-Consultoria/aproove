/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.repositories;

import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório de {@link ServicoContratado}.
 *
 * <p>A listagem por paciente alimenta o endpoint
 * {@code GET /servicos-contratados/por-paciente/{id}} da aba do cadastro.</p>
 */
@Repository
public interface ServicoContratadoRepository extends JpaRepository<ServicoContratado, Long> {

    /**
     * Lista as contratações de um paciente, da mais recente para a mais antiga.
     *
     * @param id identificador do paciente.
     * @return contratações do paciente, ordenadas pelo início da contratação.
     */
    List<ServicoContratado> findByPacienteIdOrderByInicioContratacaoDesc(Long id);

    /**
     * Contratações em aberto de um fisioterapeuta, base da agenda dele.
     *
     * <p>Em aberto é {@code fim_contratacao} nulo: contratação encerrada não gera mais
     * atendimento.</p>
     *
     * @param responsavel login do fisioterapeuta, como gravado em {@code Paciente}.
     * @return contratações sem encerramento dos pacientes sob responsabilidade dele.
     */
    List<ServicoContratado> findByFimContratacaoIsNullAndPacienteResponsavel(String responsavel);

}
