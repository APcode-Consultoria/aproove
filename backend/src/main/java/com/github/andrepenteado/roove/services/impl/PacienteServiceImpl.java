package com.github.andrepenteado.roove.services.impl;

import com.github.andrepenteado.core.common.CoreUtil;
import com.github.andrepenteado.roove.model.entities.Paciente;
import com.github.andrepenteado.roove.model.repositories.PacienteRepository;
import com.github.andrepenteado.roove.services.PacienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;

    @Override
    public List<Paciente> listar() {
        return pacienteRepository.findAllByOrderByNomeAsc();
    }

    @Override
    public Optional<Paciente> buscar(Long id) {
        return pacienteRepository.findById(id);
    }

    @Override
    public Paciente incluir(Paciente paciente, BindingResult validacao) {
        String erros = CoreUtil.validateModel(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
        if (pacienteRepository.findByCpf(paciente.getCpf()) != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, String.format("CPF %n já se encontra cadastrado"));
        paciente.setDataCadastro(LocalDateTime.now());
        return pacienteRepository.save(paciente);
    }

    @Override
    public Paciente alterar(Paciente paciente, Long id, BindingResult validacao) {
        String erros = CoreUtil.validateModel(validacao);
        if (erros != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, erros);
        Paciente pacienteAlterar = buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %n não encontrado", id)));
        BeanUtils.copyProperties(paciente, pacienteAlterar);
        if (pacienteAlterar.getId() != id)
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar paciente ID %n, porém enviado dados do paciente %n", id, pacienteAlterar.getId()));
        return pacienteRepository.save(paciente);
    }

    @Override
    public void excluir(Long id) {
        try {
            pacienteRepository.deleteById(id);
        }
        catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public Integer total() {
        return pacienteRepository.total();
    }

}
