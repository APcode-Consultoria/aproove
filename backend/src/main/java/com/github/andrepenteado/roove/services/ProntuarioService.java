package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.entities.Prontuario;
import jakarta.validation.Valid;

import java.util.List;

public interface ProntuarioService {

    List<Prontuario> listarProntuariosPorPaciente(Long idPaciente);

    Prontuario incluir(@Valid Prontuario prontuario);

    void excluir(Long id);

    Integer total();

}
