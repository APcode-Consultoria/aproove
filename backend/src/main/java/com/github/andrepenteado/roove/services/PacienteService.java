package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import br.unesp.fc.andrepenteado.core.web.services.SecurityService;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.repositories.PacienteRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_DIRETOR;
import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

@Service
@RequiredArgsConstructor
@Validated
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    private final SecurityService securityService;

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public List<Paciente> listar() {
        if (securityService.hasPerfil(PERFIL_DIRETOR))
            return pacienteRepository.findAllByOrderByNomeAsc();
        return pacienteRepository.findAllByResponsavelOrderByNomeAsc(securityService.getUserLogin().getLogin());
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Paciente buscar(Long id) {
        Paciente paciente = pacienteRepository.findById(id).orElse(null);

        if (Objects.isNull(paciente))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        if (!paciente.getResponsavel().equals(securityService.getUserLogin().getLogin())
           &&
           !securityService.hasPerfil(PERFIL_DIRETOR)
        ) {
            throw new AccessDeniedException("Permissão negada");
        }

        return paciente;
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Paciente incluir(@Valid Paciente paciente) {
        if (pacienteRepository.findByCpf(paciente.getCpf()) != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, String.format("CPF %s já se encontra cadastrado", paciente.getCpf()));

        UserLogin userLogin = securityService.getUserLogin();

        paciente.setId(null);
        paciente.setDataCadastro(LocalDateTime.now());
        paciente.setUsuarioCadastro(userLogin.getLogin());
        if (!securityService.hasPerfil(PERFIL_DIRETOR) || paciente.getResponsavel() == null || paciente.getResponsavel().isBlank())
            paciente.setResponsavel(userLogin.getLogin());
        return pacienteRepository.save(paciente);
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Paciente alterar(@Valid Paciente paciente, Long id) {
        Paciente pacienteAlterar = buscar(id);
        String responsavelAtual = pacienteAlterar.getResponsavel();

        BeanUtils.copyProperties(paciente, pacienteAlterar);

        if (!Objects.equals(pacienteAlterar.getId(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar paciente ID %s, porém enviado dados do paciente %s", id, pacienteAlterar.getId()));

        UserLogin userLogin = securityService.getUserLogin();

        if (!securityService.hasPerfil(PERFIL_DIRETOR))
            paciente.setResponsavel(responsavelAtual);

        paciente.setDataUltimaAtualizacao(LocalDateTime.now());
        paciente.setUsuarioUltimaAtualizacao(userLogin.getLogin());

        return pacienteRepository.save(paciente);
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public void excluir(Long id) {
        Paciente pacienteExcluir = buscar(id);
        pacienteRepository.delete(pacienteExcluir);
    }

    @Secured({ PERFIL_DIRETOR })
    public Integer total() {
        return pacienteRepository.total();
    }

}
