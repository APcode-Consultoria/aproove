package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

public interface PacienteService {

    List<Paciente> listar();

    Optional<Paciente> buscar(Long id);

    Paciente incluir(@Valid Paciente paciente, UserLogin userLogin);

    Paciente alterar(@Valid Paciente paciente, Long id, UserLogin userLogin);

    void excluir(Long id);

    Integer total();

}
