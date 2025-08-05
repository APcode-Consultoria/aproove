package com.github.andrepenteado.roove.services.impl;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.repositories.PacienteRepository;
import com.github.andrepenteado.roove.services.PacienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Validated
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
    public Paciente incluir(Paciente paciente, UserLogin userLogin) {
        if (pacienteRepository.findByCpf(paciente.getCpf()) != null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, String.format("CPF %s já se encontra cadastrado", paciente.getCpf()));
        paciente.setId(null);
        paciente.setDataCadastro(LocalDateTime.now());
        paciente.setUsuarioCadastro(userLogin.getNome());
        return pacienteRepository.save(paciente);
    }

    @Override
    public Paciente alterar(Paciente paciente, Long id, UserLogin userLogin) {
        Paciente pacienteAlterar = buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %s não encontrado", id)));
        BeanUtils.copyProperties(paciente, pacienteAlterar);
        if (!Objects.equals(pacienteAlterar.getId(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar paciente ID %s, porém enviado dados do paciente %s", id, pacienteAlterar.getId()));
        paciente.setDataUltimaAtualizacao(LocalDateTime.now());
        paciente.setUsuarioUltimaAtualizacao(userLogin.getNome());
        return pacienteRepository.save(paciente);
    }

    @Override
    public void excluir(Long id) {
        Paciente pacienteExcluir = buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %s não encontrado", id)));
        pacienteRepository.delete(pacienteExcluir);
    }

    @Override
    public Integer total() {
        return pacienteRepository.total();
    }

}
