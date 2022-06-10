package br.com.apcode.roove.resources;

import java.util.List;

import org.springframework.beans.BeanUtils;
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

import br.com.apcode.roove.model.Paciente;
import br.com.apcode.roove.services.PacienteService;
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
        return pacienteService.listar();
    }

    @GetMapping("/{id}")
    public Paciente buscar(@PathVariable Long id) {
        log.info("Buscar paciente: " + id);
        return pacienteService.buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %n não encontrado", id)));
    }

    @PostMapping
    public Paciente incluir(@RequestBody Paciente paciente) {
        log.info("Incluir novo paciente");
        return pacienteService.gravar(paciente);
    }

    @PutMapping("/{id}")
    public Paciente alterar(@RequestBody Paciente paciente, @PathVariable Long id) {
        log.info("Alterar dados do paciente de ID: " + id);
        Paciente pacienteAlterar = pacienteService.buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID %n não encontrado", id)));
        BeanUtils.copyProperties(paciente, pacienteAlterar);
        if (pacienteAlterar.getId() != id)
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Solicitado alterar paciente ID %n, porém enviado dados do paciente %n", id, pacienteAlterar.getId()));
        return pacienteService.gravar(pacienteAlterar);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir paciente de ID: " + id);
        pacienteService.excluir(id);
    }

}
