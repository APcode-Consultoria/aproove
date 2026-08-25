/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.repositories;

import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
     * Contratações de um fisioterapeuta vigentes em algum dia do período.
     *
     * <p>Vigente é a contratação cujo período cruza o consultado: começou até o último
     * dia dele e ainda não tinha terminado no primeiro. Base tanto da agenda quanto da
     * regra "sem choque de horário", que precisam enxergar exatamente os mesmos
     * atendimentos.</p>
     *
     * <p>Filtrar por {@code fim_contratacao} nulo — o que a agenda fazia antes — não
     * serve: <b>toda</b> contratação AVULSO nasce com fim preenchido pela regra
     * "contratação avulsa nasce fechada", e ela ocupa a agenda nas datas dela como
     * qualquer outra. Uma contratação encerrada também continua tendo acontecido nos
     * dias em que esteve em vigor; quem corta a expansão no dia do encerramento é o
     * {@code AgendaService}, não esta consulta.</p>
     *
     * @param responsavel login do fisioterapeuta, como gravado em {@code Paciente}.
     * @param inicio primeiro dia do período.
     * @param fim último dia do período.
     * @return contratações que têm ocorrência possível dentro do período.
     */
    @Query("""
        select servicoContratado
          from ServicoContratado servicoContratado
         where servicoContratado.paciente.responsavel = :responsavel
           and servicoContratado.inicioContratacao <= :fim
           and (servicoContratado.fimContratacao is null or servicoContratado.fimContratacao >= :inicio)
        """)
    List<ServicoContratado> buscarVigentesNoPeriodo(
        @Param("responsavel") String responsavel,
        @Param("inicio") LocalDate inicio,
        @Param("fim") LocalDate fim
    );

}
