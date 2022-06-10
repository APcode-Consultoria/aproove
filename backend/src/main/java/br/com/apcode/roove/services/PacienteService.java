package br.com.apcode.roove.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.apcode.roove.model.Paciente;
import br.com.apcode.roove.repositories.PacienteRepository;
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
