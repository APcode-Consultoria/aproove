package com.github.andrepenteado.roove.resources;

import java.util.List;

import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.github.andrepenteado.roove.model.Paciente;
import com.github.andrepenteado.roove.services.PacienteService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
@Slf4j
public class PacienteResource {

    private final PacienteService pacienteService;

    @GetMapping
    public List<Paciente> listar() {
        log.info("Listar todos pacientes");
        try {
            return pacienteService.listar();
        }
        catch (Exception ex) {
            log.error("Erro inesperado", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro inesperado");
        }
    }

    @GetMapping("/{id}")
    public Paciente buscar(@PathVariable Long id) {
        log.info("Buscar paciente: " + id);
        try {
            return pacienteService.buscar(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %n não encontrado", id)));
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (Exception ex) {
            log.error("Erro inesperado", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro inesperado");
        }
    }

    @PostMapping
    public Paciente incluir(@RequestBody Paciente paciente) {
        log.info("Incluir novo paciente");
        try {
            return pacienteService.incluir(paciente);
        }
        catch (ConstraintViolationException cvex) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, cvex.getMessage());
        }
        catch (Exception ex) {
            log.error("Erro inesperado", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro inesperado");
        }
    }

    @PutMapping("/{id}")
    public Paciente alterar(@RequestBody Paciente paciente, @PathVariable Long id) {
        log.info("Alterar dados do paciente de ID: " + id);
        try {
            return pacienteService.alterar(paciente, id);
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (ConstraintViolationException cvex) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, cvex.getMessage());
        }
        catch (Exception ex) {
            log.error("Erro inesperado", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro inesperado");
        }
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir paciente de ID: " + id);
        try {
            pacienteService.excluir(id);
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (Exception ex) {
            log.error("Erro inesperado", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro inesperado");
        }
    }

}
