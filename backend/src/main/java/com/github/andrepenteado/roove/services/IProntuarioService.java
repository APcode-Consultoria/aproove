package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.models.Prontuario;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface IProntuarioService {

    List<Prontuario> listarProntuariosPorPaciente(Long idPaciente);

    Prontuario incluir(Prontuario prontuario, BindingResult validacao);

    void excluir(Long id);

    Integer total();

}
