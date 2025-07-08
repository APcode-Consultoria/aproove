package com.github.andrepenteado.roove.services.impl;

import com.github.andrepenteado.roove.domain.entities.Prontuario;
import com.github.andrepenteado.roove.domain.repositories.ProntuarioRepository;
import com.github.andrepenteado.roove.services.ProntuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class ProntuarioServiceImpl implements ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    @Override
    public List<Prontuario> listarProntuariosPorPaciente(Long idPaciente) {
        return prontuarioRepository.findByPacienteIdOrderByDataRegistroDesc(idPaciente);
    }

    @Override
    public Prontuario incluir(@Valid Prontuario prontuario) {
        prontuario.setDataRegistro(LocalDateTime.now());
        return prontuarioRepository.save(prontuario);
    }

    @Override
    public void excluir(Long id) {
        try {
            prontuarioRepository.deleteById(id);
        }
        catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public Integer total() {
        return prontuarioRepository.total();
    }

}
