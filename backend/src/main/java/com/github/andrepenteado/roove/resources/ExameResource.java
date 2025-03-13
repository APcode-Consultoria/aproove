package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Exame;
import com.github.andrepenteado.roove.services.ExameService;
import io.micrometer.observation.annotation.Observed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.github.andrepenteado.roove.RooveApplication.PERFIL_FISIOTERAPEUTA;

@RestController
@RequestMapping("/exames")
@RequiredArgsConstructor
@Observed
@Slf4j
public class ExameResource {

    private final ExameService exameService;

    @GetMapping("/{idPaciente}")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public List<Exame> listarPorPaciente(@PathVariable Long idPaciente) {
        log.info("Listar exames do paciente #{}", idPaciente);
        return exameService.listarProntuariosPorPaciente(idPaciente);
    }

    @PostMapping
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Exame incluir(@Valid @RequestBody Exame exame, BindingResult validacao) {
        log.info("Incluir novo exame {}", exame.toString());
        return exameService.incluir(exame, validacao);
    }

    @DeleteMapping("/{id}")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public void excluir(@PathVariable Long id) {
        log.info("Excluir exame de ID #{}", id);
        exameService.excluir(id);
    }

    @GetMapping("/total")
    @Secured({ PERFIL_FISIOTERAPEUTA })
    public Integer total() {
        Integer total = exameService.total();
        log.info("Total de exames: {}", total);
        return total;
    }

}
