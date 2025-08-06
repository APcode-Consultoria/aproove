package com.github.andrepenteado.roove.resources;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.services.PacienteService;
import com.github.andrepenteado.roove.services.ProntuarioService;
import io.micrometer.observation.annotation.Observed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
@Observed
@Slf4j
public class PacienteResource {

    private final PacienteService pacienteService;

    private final ProntuarioService prontuarioService;

    @GetMapping
    public List<Paciente> listar() {
        log.info("Listar todos pacientes");
        return pacienteService.listar();
    }

    @GetMapping("/{id}")
    public Paciente buscar(@PathVariable Long id) {
        log.info("Buscar paciente de ID #{}", id);
        return pacienteService.buscar(id);
    }

    @PostMapping
    public Paciente incluir(@RequestBody Paciente paciente, @AuthenticationPrincipal UserLogin userLogin) {
        log.info("Incluir novo paciente {}", paciente.toString());
        return pacienteService.incluir(paciente);
    }

    @PutMapping("/{id}")
    public Paciente alterar(@PathVariable Long id, @RequestBody Paciente paciente) {
        log.info("Alterar dados do paciente {}", paciente);
        return pacienteService.alterar(paciente, id);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir paciente de ID #{}", id);
        if (!prontuarioService.listarProntuariosPorPaciente(id).isEmpty())
            throw new ResponseStatusException(HttpStatus.FOUND, "Existe registros no prontuário do paciente");
        pacienteService.excluir(id);
    }

    @GetMapping("/total")
    public Integer total() {
        Integer total = pacienteService.total();
        log.info("Total de pacientes: {}", total);
        return total;
    }

}
