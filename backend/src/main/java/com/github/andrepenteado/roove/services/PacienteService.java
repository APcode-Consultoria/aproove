package com.github.andrepenteado.roove.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.server.ResponseStatusException;

import com.github.andrepenteado.roove.RooveApplication;
import com.github.andrepenteado.roove.models.Paciente;
import com.github.andrepenteado.roove.repositories.PacienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public List<Paciente> listar() {
        return pacienteRepository.findAllByOrderByNomeAsc();
    }

    public Optional<Paciente> buscar(Long id) {
        return pacienteRepository.findById(id);
    }

    public Paciente incluir(Paciente paciente, BindingResult validacao) throws Exception {
        String erros = RooveApplication.validar(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
        if (pacienteRepository.findByCpf(paciente.getCpf()) != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "CPF de paciente já se encontra cadastrado");
        paciente.setDataCadastro(LocalDateTime.now());
        return pacienteRepository.save(paciente);
    }

    public Paciente alterar(Paciente paciente, Long id, BindingResult validacao) throws Exception {
        String erros = RooveApplication.validar(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
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
