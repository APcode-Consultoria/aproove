/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.services.SecurityService;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
import com.github.andrepenteado.roove.domain.repositories.ServicoContratadoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_DIRETOR;
import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

/**
 * Regras de negócio dos serviços contratados por um paciente.
 *
 * <p>Os {@code @Secured} vêm de {@code lista.acoes} em .cruds/paciente.yaml: os dois
 * perfis consultam, contratam e encerram, e só o DIRETOR exclui — excluir apaga
 * histórico de contratação.</p>
 */
@Service
@RequiredArgsConstructor
@Validated
@Slf4j
public class ServicoContratadoService {

    private final ServicoContratadoRepository servicoContratadoRepository;

    private final PacienteService pacienteService;

    private final SecurityService securityService;

    /**
     * Lista as contratações de um paciente.
     *
     * <p>Passa pelo {@code PacienteService.buscar} de propósito: é ele que aplica a
     * regra de visibilidade por responsável, e a coleção não pode contorná-la.</p>
     *
     * @param idPaciente identificador do paciente.
     * @return contratações do paciente, da mais recente para a mais antiga.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public List<ServicoContratado> listarPorPaciente(Long idPaciente) {
        Paciente paciente = pacienteService.buscar(idPaciente);
        return servicoContratadoRepository.findByPacienteIdOrderByInicioContratacaoDesc(paciente.getId());
    }

    /**
     * Busca uma contratação pela chave primária.
     *
     * @param id identificador da contratação.
     * @return contratação encontrada.
     * @throws ResponseStatusException 404 quando não existe contratação com o ID.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado buscar(Long id) {
        return servicoContratadoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    /**
     * Inclui uma nova contratação, preenchendo a auditoria de criação.
     *
     * @param servicoContratado dados da contratação.
     * @return contratação gravada, já com o ID gerado.
     * @throws ResponseStatusException 409 quando o payload traz um ID (não é inclusão).
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado incluir(@Valid ServicoContratado servicoContratado) {
        if (Objects.nonNull(servicoContratado.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado incluir serviço contratado, porém enviado dados do serviço contratado ID %s", servicoContratado.getId()));

        // Regra "valor contratado só pelo diretor" (.cruds/paciente.yaml): na inclusão,
        // o valor enviado por quem não é diretor é descartado e a contratação nasce sem
        // valor, para o diretor preencher depois.
        if (!securityService.hasPerfil(PERFIL_DIRETOR))
            servicoContratado.setValorContratado(null);

        servicoContratado.setDataCadastro(LocalDateTime.now());
        servicoContratado.setUsuarioCadastro(securityService.getUserLogin().getLogin());

        return servicoContratadoRepository.save(servicoContratado);
    }

    /**
     * Altera uma contratação, preservando a auditoria de criação.
     *
     * @param servicoContratado dados novos da contratação.
     * @param id identificador da contratação a alterar.
     * @return contratação gravada.
     * @throws ResponseStatusException 409 quando o ID do payload não é o da URL.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado alterar(@Valid ServicoContratado servicoContratado, Long id) {
        if (!Objects.equals(servicoContratado.getId(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar serviço contratado ID %s, porém enviado dados do serviço contratado %s", id, servicoContratado.getId()));

        ServicoContratado existente = buscar(id);

        // Regra "valor contratado só pelo diretor" (.cruds/paciente.yaml): quem não é
        // diretor tem o valor recebido descartado e o do registro existente reposto.
        // Esconder o campo na tela nunca foi barreira — a barreira é esta.
        if (!securityService.hasPerfil(PERFIL_DIRETOR))
            servicoContratado.setValorContratado(existente.getValorContratado());

        servicoContratado.setDataCadastro(existente.getDataCadastro());
        servicoContratado.setUsuarioCadastro(existente.getUsuarioCadastro());

        servicoContratado.setDataUltimaAtualizacao(LocalDateTime.now());
        servicoContratado.setUsuarioUltimaAtualizacao(securityService.getUserLogin().getLogin());

        return servicoContratadoRepository.save(servicoContratado);
    }

    /**
     * Encerra uma contratação, gravando hoje no fim da contratação.
     *
     * <p>Regra "encerrar contratação" declarada em .cruds/paciente.yaml. É um comando
     * sobre um registro: não recebe nenhum dado além do ID, e por isso a tela não
     * precisa abrir a contratação para edição.</p>
     *
     * @param id identificador da contratação a encerrar.
     * @return contratação já encerrada.
     * @throws ResponseStatusException 422 quando a contratação já está encerrada.
     */
    @Secured({ PERFIL_FISIOTERAPEUTA, PERFIL_DIRETOR })
    public ServicoContratado encerrar(Long id) {
        ServicoContratado servicoContratado = buscar(id);

        if (Objects.nonNull(servicoContratado.getFimContratacao()))
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, String.format("Contratação do serviço %s já foi encerrada em %s", servicoContratado.getServico().getNome(), servicoContratado.getFimContratacao()));

        servicoContratado.setFimContratacao(LocalDate.now());
        servicoContratado.setDataUltimaAtualizacao(LocalDateTime.now());
        servicoContratado.setUsuarioUltimaAtualizacao(securityService.getUserLogin().getLogin());

        log.info("Encerrar contratação do serviço {}", servicoContratado.getServico().getNome());

        return servicoContratadoRepository.save(servicoContratado);
    }

    /**
     * Exclui uma contratação.
     *
     * <p>Exclusivo do DIRETOR: excluir apaga histórico, diferente de encerrar.</p>
     *
     * @param id identificador da contratação a excluir.
     */
    @Secured(PERFIL_DIRETOR)
    public void excluir(Long id) {
        servicoContratadoRepository.deleteById(id);
    }

}
