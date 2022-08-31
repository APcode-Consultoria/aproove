package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.RooveApplication;
import com.github.andrepenteado.roove.models.Exame;
import com.github.andrepenteado.roove.repositories.ExameRepository;
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
public class ExameService {

    private final ExameRepository exameRepository;

    public List<Exame> listarProntuariosPorPaciente(Long idPaciente) {
        return exameRepository.findByPacienteIdOrderByDescricao(idPaciente);
    }

    public Exame incluir(Exame exame, BindingResult validacao) throws Exception {
        String erros = RooveApplication.validar(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
        exame.setDataUpload(LocalDateTime.now());
        return exameRepository.save(exame);
    }

    public void excluir(Long id) {
        try {
            exameRepository.deleteById(id);
        }
        catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

}
