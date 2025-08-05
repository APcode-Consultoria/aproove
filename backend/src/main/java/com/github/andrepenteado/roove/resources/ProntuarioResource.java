package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Prontuario;
import com.github.andrepenteado.roove.services.ProntuarioService;
import io.micrometer.observation.annotation.Observed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

@RestController
@RequestMapping("/prontuarios")
@RequiredArgsConstructor
@Observed
@Slf4j
public class ProntuarioResource {

    private final ProntuarioService prontuarioService;

    @GetMapping("/{idPaciente}")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public List<Prontuario> listarPorPaciente(@PathVariable Long idPaciente) {
        log.info("Listar prontuário do paciente #{}", idPaciente);
        return prontuarioService.listarProntuariosPorPaciente(idPaciente);
    }

    @PostMapping
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Prontuario incluir(@RequestBody Prontuario prontuario) {
        log.info("Incluir novo prontuário {}", prontuario.toString());
        return prontuarioService.incluir(prontuario);
    }

    @DeleteMapping("/{id}")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public void excluir(@PathVariable Long id) {
        log.info("Excluir prontuário de ID #{}", id);
        prontuarioService.excluir(id);
    }

    @GetMapping("/total")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Integer total() {
        Integer total = prontuarioService.total();
        log.info("Total de atendimentos: {}", total);
        return total;
    }

}
