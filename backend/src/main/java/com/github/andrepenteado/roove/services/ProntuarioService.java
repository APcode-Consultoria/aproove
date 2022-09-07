package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.RooveApplication;
import com.github.andrepenteado.roove.models.Prontuario;
import com.github.andrepenteado.roove.repositories.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    public List<Prontuario> listarProntuariosPorPaciente(Long idPaciente) {
        return prontuarioRepository.findByPacienteIdOrderByDataRegistroDesc(idPaciente);
    }

    public Prontuario incluir(Prontuario prontuario, BindingResult validacao) throws Exception {
        String erros = RooveApplication.validar(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
        prontuario.setDataRegistro(LocalDateTime.now());
        return prontuarioRepository.save(prontuario);
    }

    public void excluir(Long id) {
        try {
            prontuarioRepository.deleteById(id);
        }
        catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    public Integer total() {
        return prontuarioRepository.total();
    }

}
