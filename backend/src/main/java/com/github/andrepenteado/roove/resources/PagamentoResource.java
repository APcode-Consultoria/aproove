/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Pagamento;
import com.github.andrepenteado.roove.domain.filter.PagamentoFilter;
import com.github.andrepenteado.roove.services.PagamentoService;
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
 * Endpoints REST dos pagamentos das contratações.
 *
 * <p>A ação Pagar da aba é um {@code PUT} comum: ela preenche campos do registro, e o
 * contrato reserva ação customizada para comando sem dado digitado.</p>
 */
@RestController
@RequestMapping("/pagamentos")
@RequiredArgsConstructor
@Observed
@Slf4j
public class PagamentoResource {

    private final PagamentoService pagamentoService;

    /**
     * Lista todos os pagamentos.
     *
     * @return todos os pagamentos.
     */
    @GetMapping
    public List<Pagamento> listar() {
        log.info("Listar todos pagamentos");
        return pagamentoService.listar();
    }

    /**
     * Pesquisa pagamentos pelos critérios recebidos como query params.
     *
     * @param filtro situação e período de vencimento.
     * @return pagamentos que atendem ao filtro.
     */
    @GetMapping("/pesquisar")
    public List<Pagamento> pesquisar(PagamentoFilter filtro) {
        log.info("Pesquisar pagamentos com filtro {}", filtro);
        return pagamentoService.pesquisar(filtro);
    }

    /**
     * Lista os pagamentos de um paciente.
     *
     * @param id identificador do paciente.
     * @return pagamentos do paciente.
     */
    @GetMapping("/por-paciente/{id}")
    public List<Pagamento> listarPorPaciente(@PathVariable Long id) {
        log.info("Listar pagamentos do paciente de ID #{}", id);
        return pagamentoService.listarPorPaciente(id);
    }

    /**
     * Busca um pagamento pela chave primária.
     *
     * @param id identificador do pagamento.
     * @return pagamento encontrado.
     */
    @GetMapping("/{id}")
    public Pagamento buscar(@PathVariable Long id) {
        log.info("Buscar pagamento de ID #{}", id);
        return pagamentoService.buscar(id);
    }

    /**
     * Inclui um pagamento avulso.
     *
     * @param pagamento dados do pagamento.
     * @return pagamento gravado.
     */
    @PostMapping
    public Pagamento incluir(@RequestBody Pagamento pagamento) {
        log.info("Incluir novo pagamento {}", pagamento);
        return pagamentoService.incluir(pagamento);
    }

    /**
     * Altera um pagamento — caminho da ação Pagar.
     *
     * @param id identificador do pagamento a alterar.
     * @param pagamento dados novos do pagamento.
     * @return pagamento gravado.
     */
    @PutMapping("/{id}")
    public Pagamento alterar(@PathVariable Long id, @RequestBody Pagamento pagamento) {
        log.info("Alterar dados do pagamento de ID #{}", id);
        return pagamentoService.alterar(pagamento, id);
    }

    /**
     * Exclui um pagamento.
     *
     * @param id identificador do pagamento a excluir.
     */
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir pagamento de ID #{}", id);
        pagamentoService.excluir(id);
    }

}
