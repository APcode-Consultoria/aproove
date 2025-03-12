package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Optional;

public interface PacienteService {

    List<Paciente> listar();

    Optional<Paciente> buscar(Long id);

    Paciente incluir(Paciente paciente, UserLogin userLogin, BindingResult validacao);

    Paciente alterar(Paciente paciente, Long id, UserLogin userLogin, BindingResult validacao);

    void excluir(Long id);

    Integer total();

}
