package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.services.SecurityService;
import com.github.andrepenteado.roove.domain.entities.Exame;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.repositories.ExameRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_DIRETOR;
import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

@Service
@RequiredArgsConstructor
@Validated
public class ExameService {

    private final ExameRepository exameRepository;

    private final PacienteService pacienteService;

    private final SecurityService securityService;

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public List<Exame> listarProntuariosPorPaciente(Long idPaciente) {
        Paciente paciente = pacienteService.buscar(idPaciente);
        return exameRepository.findByPacienteOrderByDescricao(paciente);
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Exame incluir(@Valid Exame exame) {
        exame.setDataUpload(LocalDateTime.now());
        exame.setUsuarioUpload(securityService.getUserLogin().getLogin());
        return exameRepository.save(exame);
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public void excluir(Long id) {
        Exame exame = exameRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        exameRepository.delete(exame);
    }

    @Secured({ PERFIL_DIRETOR })
    public Integer total() {
        return exameRepository.total();
    }

}
