package com.github.andrepenteado.roove.resources;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.services.PacienteService;
import com.github.andrepenteado.roove.services.ProntuarioService;
import io.micrometer.observation.annotation.Observed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
@Observed
@Slf4j
public class PacienteResource {

    private final PacienteService pacienteService;

    private final ProntuarioService prontuarioService;

    @GetMapping
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public List<Paciente> listar() {
        log.info("Listar todos pacientes");
        return pacienteService.listar();
    }

    @GetMapping("/{id}")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Paciente buscar(@PathVariable Long id) {
        log.info("Buscar paciente de ID #{}", id);
        return pacienteService.buscar(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Paciente de ID #%n não encontrado", id)));
    }

    @PostMapping
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Paciente incluir(@Valid @RequestBody Paciente paciente, @AuthenticationPrincipal UserLogin userLogin, BindingResult validacao) {
        log.info("Incluir novo paciente {}", paciente.toString());
        return pacienteService.incluir(paciente, userLogin, validacao);
    }

    @PutMapping("/{id}")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Paciente alterar(@PathVariable Long id, @Valid @RequestBody Paciente paciente, @AuthenticationPrincipal UserLogin userLogin, BindingResult validacao) {
        log.info("Alterar dados do paciente {}", paciente);
        return pacienteService.alterar(paciente, id, userLogin, validacao);
    }

    @DeleteMapping("/{id}")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public void excluir(@PathVariable Long id) {
        log.info("Excluir paciente de ID #{}", id);
        if (!prontuarioService.listarProntuariosPorPaciente(id).isEmpty())
            throw new ResponseStatusException(HttpStatus.FOUND, "Existe registros no prontuário do paciente");
        pacienteService.excluir(id);
    }

    @GetMapping("/total")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Integer total() {
        Integer total = pacienteService.total();
        log.info("Total de pacientes: {}", total);
        return total;
    }

}
