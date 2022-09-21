package com.github.andrepenteado.roove.services;

import com.github.andrepenteado.roove.models.Paciente;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Optional;

public interface IPacienteService {

    List<Paciente> listar();

    Optional<Paciente> buscar(Long id);

    Paciente incluir(Paciente paciente, BindingResult validacao);

    Paciente alterar(Paciente paciente, Long id, BindingResult validacao);

    void excluir(Long id);

    Integer total();

}
