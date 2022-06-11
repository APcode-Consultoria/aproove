package com.github.andrepenteado.roove.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public Paciente incluir(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public Paciente alterar(Paciente paciente, Long id) throws ResponseStatusException {
        Paciente pacienteAlterar = buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %n não encontrado", id)));
        BeanUtils.copyProperties(paciente, pacienteAlterar);
        if (pacienteAlterar.getId() != id)
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar paciente ID %n, porém enviado dados do paciente %n", id, pacienteAlterar.getId()));
        return pacienteRepository.save(paciente);
    }

    public void excluir(Long id) {
        pacienteRepository.deleteById(id);
    }

}
