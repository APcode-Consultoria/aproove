package com.github.andrepenteado.roove.services.impl;

import com.github.andrepenteado.roove.RooveApplication;
import com.github.andrepenteado.roove.models.Exame;
import com.github.andrepenteado.roove.repositories.ExameRepository;
import com.github.andrepenteado.roove.services.IExameService;
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
public class ExameServiceImpl implements IExameService {

    private final ExameRepository exameRepository;

    @Override
    public List<Exame> listarProntuariosPorPaciente(Long idPaciente) {
        return exameRepository.findByPacienteIdOrderByDescricao(idPaciente);
    }

    @Override
    public Exame incluir(Exame exame, BindingResult validacao) {
        String erros = RooveApplication.validar(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
        exame.setDataUpload(LocalDateTime.now());
        return exameRepository.save(exame);
    }

    @Override
    public void excluir(Long id) {
        try {
            exameRepository.deleteById(id);
        }
        catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public Integer total() {
        return exameRepository.total();
    }

}
