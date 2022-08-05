package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.models.Prontuario;
import com.github.andrepenteado.roove.repositories.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    public List<Prontuario> listarProntuariosPorPaciente(Long idPaciente) {
        return prontuarioRepository.findByPacienteIdOrderByDataRegistroDesc(idPaciente);
    }

}
