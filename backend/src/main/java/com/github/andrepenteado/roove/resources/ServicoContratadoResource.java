/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import com.github.andrepenteado.roove.services.ServicoContratadoService;
import io.micrometer.observation.annotation.Observed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoints REST dos serviços contratados por um paciente.
 *
 * <p>Só delega ao {@link ServicoContratadoService}: a autorização por ação e a auditoria
 * vivem lá, e o resource não as repete.</p>
 */
@RestController
@RequestMapping("/servicos-contratados")
@RequiredArgsConstructor
@Observed
@Slf4j
public class ServicoContratadoResource {

    private final ServicoContratadoService servicoContratadoService;

    /**
     * Lista as contratações de um paciente.
     *
     * <p>O caminho é {@code por-paciente/{id}} e não {@code /{idPaciente}} para não
     * colidir com o {@code GET /{id}}, que busca a contratação pela própria chave.</p>
     *
     * @param id identificador do paciente.
     * @return contratações do paciente.
     */
    @GetMapping("/por-paciente/{id}")
    public List<ServicoContratado> listarPorPaciente(@PathVariable Long id) {
        log.info("Listar serviços contratados do paciente de ID #{}", id);
        return servicoContratadoService.listarPorPaciente(id);
    }

    /**
     * Busca uma contratação pela chave primária.
     *
     * @param id identificador da contratação.
     * @return contratação encontrada.
     */
    @GetMapping("/{id}")
    public ServicoContratado buscar(@PathVariable Long id) {
        log.info("Buscar serviço contratado de ID #{}", id);
        return servicoContratadoService.buscar(id);
    }

    /**
     * Inclui uma nova contratação.
     *
     * @param servicoContratado dados da contratação.
     * @return contratação gravada.
     */
    @PostMapping
    public ServicoContratado incluir(@RequestBody ServicoContratado servicoContratado) {
        log.info("Incluir novo serviço contratado {}", servicoContratado);
        return servicoContratadoService.incluir(servicoContratado);
    }

    /**
     * Altera uma contratação.
     *
     * @param id identificador da contratação a alterar.
     * @param servicoContratado dados novos da contratação.
     * @return contratação gravada.
     */
    @PutMapping("/{id}")
    public ServicoContratado alterar(@PathVariable Long id, @RequestBody ServicoContratado servicoContratado) {
        log.info("Alterar dados do serviço contratado de ID #{}", id);
        return servicoContratadoService.alterar(servicoContratado, id);
    }

    /**
     * Encerra uma contratação, gravando hoje no fim da contratação.
     *
     * <p>{@code POST} sem body: é um comando sobre um registro, não substituição do
     * recurso nem edição de campo.</p>
     *
     * @param id identificador da contratação a encerrar.
     * @return contratação já encerrada.
     */
    @PostMapping("/{id}/encerrar")
    public ServicoContratado encerrar(@PathVariable Long id) {
        log.info("Encerrar contratação de serviço de ID #{}", id);
        return servicoContratadoService.encerrar(id);
    }

    /**
     * Exclui uma contratação.
     *
     * @param id identificador da contratação a excluir.
     */
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir serviço contratado de ID #{}", id);
        servicoContratadoService.excluir(id);
    }

}
