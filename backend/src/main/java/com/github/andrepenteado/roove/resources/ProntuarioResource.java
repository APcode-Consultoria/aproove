package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Prontuario;
import com.github.andrepenteado.roove.services.ProntuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

@RestController
@RequestMapping("/prontuarios")
@RequiredArgsConstructor
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
    public Prontuario incluir(@Valid @RequestBody Prontuario prontuario, BindingResult validacao) {
        log.info("Incluir novo prontuário {}", prontuario.toString());
        return prontuarioService.incluir(prontuario, validacao);
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
