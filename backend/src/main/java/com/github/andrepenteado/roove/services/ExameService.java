package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.entities.Exame;
import jakarta.validation.Valid;

import java.util.List;

public interface ExameService {

    List<Exame> listarProntuariosPorPaciente(Long idPaciente);

    Exame incluir(@Valid Exame exame);

    void excluir(Long id);

    Integer total();
}
