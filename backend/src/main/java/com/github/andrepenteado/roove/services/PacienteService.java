package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.domain.entities.Paciente;
import jakarta.validation.Valid;

import java.util.List;

public interface PacienteService {

    List<Paciente> listar();

    Paciente buscar(Long id);

    Paciente incluir(@Valid Paciente paciente);

    Paciente alterar(@Valid Paciente paciente, Long id);

    void excluir(Long id);

    Integer total();

}
