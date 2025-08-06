package com.github.andrepenteado.roove.services.impl;

import com.github.andrepenteado.roove.domain.entities.Exame;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.repositories.ExameRepository;
import com.github.andrepenteado.roove.services.ExameService;
import com.github.andrepenteado.roove.services.PacienteService;
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
public class ExameServiceImpl implements ExameService {

    private final ExameRepository exameRepository;

    private final PacienteService pacienteService;

    @Override
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public List<Exame> listarProntuariosPorPaciente(Long idPaciente) {
        Paciente paciente = pacienteService.buscar(idPaciente);
        return exameRepository.findByPacienteOrderByDescricao(paciente);
    }

    @Override
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Exame incluir(Exame exame) {
        exame.setDataUpload(LocalDateTime.now());
        return exameRepository.save(exame);
    }

    @Override
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public void excluir(Long id) {
        Exame exame = exameRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        exameRepository.delete(exame);
    }

    @Override
    @Secured({ PERFIL_DIRETOR })
    public Integer total() {
        return exameRepository.total();
    }

}
