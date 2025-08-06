package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Exame;
import com.github.andrepenteado.roove.services.ExameService;
import io.micrometer.observation.annotation.Observed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exames")
@RequiredArgsConstructor
@Observed
@Slf4j
public class ExameResource {

    private final ExameService exameService;

    @GetMapping("/{idPaciente}")
    public List<Exame> listarPorPaciente(@PathVariable Long idPaciente) {
        log.info("Listar exames do paciente #{}", idPaciente);
        return exameService.listarProntuariosPorPaciente(idPaciente);
    }

    @PostMapping
    public Exame incluir(@RequestBody Exame exame) {
        log.info("Incluir novo exame {}", exame.toString());
        return exameService.incluir(exame);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        log.info("Excluir exame de ID #{}", id);
        exameService.excluir(id);
    }

    @GetMapping("/total")
    public Integer total() {
        Integer total = exameService.total();
        log.info("Total de exames: {}", total);
        return total;
    }

}
