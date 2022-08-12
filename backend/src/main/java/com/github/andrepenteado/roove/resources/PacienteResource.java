package com.github.andrepenteado.roove.resources;

import java.time.LocalDateTime;
import java.util.List;

import javax.validation.Valid;

import com.github.andrepenteado.roove.services.ProntuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.github.andrepenteado.roove.models.Paciente;
import com.github.andrepenteado.roove.services.PacienteService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
@Slf4j
public class PacienteResource {

    private final PacienteService pacienteService;

    private final ProntuarioService prontuarioService;

    @GetMapping
    public List<Paciente> listar() {
        log.info("Listar todos pacientes");
        try {
            return pacienteService.listar();
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

    @GetMapping("/{id}")
    public Paciente buscar(@PathVariable Long id) {
        log.info("Buscar paciente de ID #" + id);
        try {
            return pacienteService.buscar(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %n não encontrado", id)));
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

    @PostMapping
    public Paciente incluir(@Valid @RequestBody Paciente paciente, BindingResult validacao) {
        log.info("Incluir novo paciente " + paciente.toString());
        try {
            return pacienteService.incluir(paciente, validacao);
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

    @PutMapping("/{id}")
    public Paciente alterar(@PathVariable Long id, @Valid @RequestBody Paciente paciente, BindingResult validacao) {
        log.info("Alterar dados do paciente " + paciente);
        try {
            return pacienteService.alterar(paciente, id, validacao);
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir paciente de ID #" + id);
        try {
            if (!prontuarioService.listarProntuariosPorPaciente(id).isEmpty())
                throw new ResponseStatusException(HttpStatus.FOUND, "Existe registros no prontuário do paciente");
            pacienteService.excluir(id);
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

}
