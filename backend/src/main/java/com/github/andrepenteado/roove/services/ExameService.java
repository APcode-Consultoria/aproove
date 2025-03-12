package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.entities.Exame;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface ExameService {

    List<Exame> listarProntuariosPorPaciente(Long idPaciente);

    Exame incluir(Exame exame, BindingResult validacao);

    void excluir(Long id);

    Integer total();
}
