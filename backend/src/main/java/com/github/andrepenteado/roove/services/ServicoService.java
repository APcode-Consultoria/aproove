/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.entities.Servico;
import com.github.andrepenteado.roove.domain.filter.ServicoFilter;
import com.github.andrepenteado.roove.domain.repositories.ServicoRepository;
import br.unesp.fc.andrepenteado.core.web.services.SecurityService;
import com.querydsl.core.BooleanBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_DIRETOR;
import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

/**
 * Regras de negócio do cadastro de Serviço.
 *
 * <p>O YAML declara um único perfil (DIRETOR) e nenhum bloco {@code acoes}, então as
 * quatro operações ficam com o mesmo {@code @Secured}. A auditoria é preenchida aqui e
 * em nenhum outro lugar — o resource não participa dela.</p>
 */
@Service
@RequiredArgsConstructor
@Validated
public class ServicoService {

    private final ServicoRepository servicoRepository;

    private final SecurityService securityService;

    /**
     * Lista todos os serviços em ordem alfabética.
     *
     * <p>Única operação do cadastro liberada também ao FISIOTERAPEUTA: a aba de serviços
     * contratados do paciente precisa popular o combo de serviços, e ele contrata
     * (`lista.acoes` em .cruds/paciente.yaml). Incluir, alterar e excluir seguem
     * exclusivos do DIRETOR, e o menu e as rotas do cadastro de serviço continuam só
     * para ele.</p>
     *
     * @return serviços ordenados pelo nome.
     */
    @Secured({ PERFIL_DIRETOR, PERFIL_FISIOTERAPEUTA })
    public List<Servico> listar() {
        return servicoRepository.findAllByOrderByNomeAsc();
    }

    /**
     * Pesquisa serviços pelos critérios informados.
     *
     * @param filtro critérios da pesquisa; sem nenhum preenchido, devolve a lista completa.
     * @return serviços que atendem ao filtro, ordenados pelo nome.
     */
    @Secured(PERFIL_DIRETOR)
    public List<Servico> pesquisar(ServicoFilter filtro) {
        BooleanBuilder predicado = filtro.toPredicate();

        if (!predicado.hasValue())
            return listar();

        List<Servico> servicos = new ArrayList<>();
        servicoRepository.findAll(predicado, Sort.by("nome")).forEach(servicos::add);
        return servicos;
    }

    /**
     * Busca um serviço pela chave primária.
     *
     * @param id identificador do serviço.
     * @return serviço encontrado.
     * @throws ResponseStatusException 404 quando não existe serviço com o ID informado.
     */
    @Secured(PERFIL_DIRETOR)
    public Servico buscar(Long id) {
        return servicoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    /**
     * Inclui um novo serviço, preenchendo a auditoria de criação.
     *
     * @param servico dados do serviço a incluir.
     * @return serviço gravado, já com o ID gerado.
     * @throws ResponseStatusException 409 quando o payload traz um ID (não é inclusão).
     */
    @Secured(PERFIL_DIRETOR)
    public Servico incluir(@Valid Servico servico) {
        if (Objects.nonNull(servico.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado incluir serviço, porém enviado dados do serviço ID %s", servico.getId()));

        servico.setDataCadastro(LocalDateTime.now());
        servico.setUsuarioCadastro(securityService.getUserLogin().getLogin());

        return servicoRepository.save(servico);
    }

    /**
     * Altera um serviço existente, preservando a auditoria de criação e preenchendo a
     * de alteração.
     *
     * @param servico dados novos do serviço.
     * @param id identificador do serviço a alterar.
     * @return serviço gravado.
     * @throws ResponseStatusException 409 quando o ID do payload não é o da URL.
     */
    @Secured(PERFIL_DIRETOR)
    public Servico alterar(@Valid Servico servico, Long id) {
        if (!Objects.equals(servico.getId(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar serviço ID %s, porém enviado dados do serviço %s", id, servico.getId()));

        Servico servicoAlterar = buscar(id);

        // A criacao pertence a quem cadastrou: o payload da tela nao a redefine.
        servico.setDataCadastro(servicoAlterar.getDataCadastro());
        servico.setUsuarioCadastro(servicoAlterar.getUsuarioCadastro());

        servico.setDataUltimaAtualizacao(LocalDateTime.now());
        servico.setUsuarioUltimaAtualizacao(securityService.getUserLogin().getLogin());

        return servicoRepository.save(servico);
    }

    /**
     * Exclui um serviço.
     *
     * <p>Sem {@code try/catch}: o {@code DatabaseExceptionHandler} da lib apcore já
     * converte registro inexistente em HTTP 404 globalmente.</p>
     *
     * @param id identificador do serviço a excluir.
     */
    @Secured(PERFIL_DIRETOR)
    public void excluir(Long id) {
        servicoRepository.deleteById(id);
    }

}
