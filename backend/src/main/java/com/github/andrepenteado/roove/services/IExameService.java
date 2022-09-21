package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.models.Exame;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface IExameService {

    List<Exame> listarProntuariosPorPaciente(Long idPaciente);

    Exame incluir(Exame exame, BindingResult validacao);

    void excluir(Long id);

    Integer total();
}
