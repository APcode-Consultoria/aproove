package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.entities.Prontuario;
import com.github.andrepenteado.roove.domain.repositories.ProntuarioRepository;
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
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    private final PacienteService pacienteService;

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public List<Prontuario> listarProntuariosPorPaciente(Long idPaciente) {
        Paciente paciente = pacienteService.buscar(idPaciente);
        return prontuarioRepository.findByPacienteOrderByDataRegistroDesc(paciente);
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Prontuario incluir(@Valid Prontuario prontuario) {
        prontuario.setDataRegistro(LocalDateTime.now());
        return prontuarioRepository.save(prontuario);
    }

    @Secured({ PERFIL_FISIOTERAPEUTA })
    public void excluir(Long id) {
        Prontuario prontuario = prontuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        prontuarioRepository.delete(prontuario);
    }

    @Secured({ PERFIL_DIRETOR })
    public Integer total() {
        return prontuarioRepository.total();
    }

}
