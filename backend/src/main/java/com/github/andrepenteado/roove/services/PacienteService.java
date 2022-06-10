package com.github.andrepenteado.roove.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.github.andrepenteado.roove.model.Paciente;
import com.github.andrepenteado.roove.repositories.PacienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public List<Paciente> listar() {
        return pacienteRepository.findAll();
    }

    public Optional<Paciente> buscar(Long id) {
        return pacienteRepository.findById(id);
    }

    public Paciente gravar(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public void excluir(Long id) {
        pacienteRepository.deleteById(id);
    }

}
