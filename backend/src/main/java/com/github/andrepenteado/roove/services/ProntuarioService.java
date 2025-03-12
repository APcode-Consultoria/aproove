package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.entities.Prontuario;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface ProntuarioService {

    List<Prontuario> listarProntuariosPorPaciente(Long idPaciente);

    Prontuario incluir(Prontuario prontuario, BindingResult validacao);

    void excluir(Long id);

    Integer total();

}
