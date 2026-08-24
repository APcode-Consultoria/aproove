/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Servico;
import com.github.andrepenteado.roove.domain.filter.ServicoFilter;
import com.github.andrepenteado.roove.services.ServicoService;
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
 * Endpoints REST do cadastro de Serviço.
 *
 * <p>Só delega ao {@link ServicoService}: a autorização por perfil e a auditoria vivem
 * lá, e o resource não as repete.</p>
 */
@RestController
@RequestMapping("/servicos")
@RequiredArgsConstructor
@Observed
@Slf4j
public class ServicoResource {

    private final ServicoService servicoService;

    /**
     * Lista todos os serviços.
     *
     * @return serviços ordenados pelo nome.
     */
    @GetMapping
    public List<Servico> listar() {
        log.info("Listar todos serviços");
        return servicoService.listar();
    }

    /**
     * Pesquisa serviços pelos critérios recebidos como query params.
     *
     * @param filtro critérios da pesquisa.
     * @return serviços que atendem ao filtro.
     */
    @GetMapping("/pesquisar")
    public List<Servico> pesquisar(ServicoFilter filtro) {
        log.info("Pesquisar serviços com filtro {}", filtro);
        return servicoService.pesquisar(filtro);
    }

    /**
     * Busca um serviço pela chave primária.
     *
     * @param id identificador do serviço.
     * @return serviço encontrado.
     */
    @GetMapping("/{id}")
    public Servico buscar(@PathVariable Long id) {
        log.info("Buscar serviço de ID #{}", id);
        return servicoService.buscar(id);
    }

    /**
     * Inclui um novo serviço.
     *
     * @param servico dados do serviço a incluir.
     * @return serviço gravado.
     */
    @PostMapping
    public Servico incluir(@RequestBody Servico servico) {
        log.info("Incluir novo serviço {}", servico.getNome());
        return servicoService.incluir(servico);
    }

    /**
     * Altera um serviço existente.
     *
     * @param id identificador do serviço a alterar.
     * @param servico dados novos do serviço.
     * @return serviço gravado.
     */
    @PutMapping("/{id}")
    public Servico alterar(@PathVariable Long id, @RequestBody Servico servico) {
        log.info("Alterar dados do serviço {}", servico.getNome());
        return servicoService.alterar(servico, id);
    }

    /**
     * Exclui um serviço.
     *
     * @param id identificador do serviço a excluir.
     */
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir serviço de ID #{}", id);
        servicoService.excluir(id);
    }

}
