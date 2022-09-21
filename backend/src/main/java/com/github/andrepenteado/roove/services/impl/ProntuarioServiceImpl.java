package com.github.andrepenteado.roove.services.impl;

import com.github.andrepenteado.roove.RooveApplication;
import com.github.andrepenteado.roove.models.Prontuario;
import com.github.andrepenteado.roove.repositories.ProntuarioRepository;
import com.github.andrepenteado.roove.services.IProntuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProntuarioServiceImpl implements IProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    @Override
    public List<Prontuario> listarProntuariosPorPaciente(Long idPaciente) {
        return prontuarioRepository.findByPacienteIdOrderByDataRegistroDesc(idPaciente);
    }

    @Override
    public Prontuario incluir(Prontuario prontuario, BindingResult validacao) {
        String erros = RooveApplication.validar(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
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
