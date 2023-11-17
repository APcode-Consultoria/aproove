package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.model.entities.Exame;
import com.github.andrepenteado.roove.services.ExameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/exames")
@RequiredArgsConstructor
@Slf4j
public class ExameResource {

    private final ExameService exameService;

    @GetMapping("/{idPaciente}")
    public List<Exame> listarPorPaciente(@PathVariable Long idPaciente) {
        log.info("Listar exames do paciente #" + idPaciente);
        try {
            return exameService.listarProntuariosPorPaciente(idPaciente);
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

    @PostMapping
    public Exame incluir(@Valid @RequestBody Exame exame, BindingResult validacao) {
        log.info("Incluir novo exame " + exame.toString());
        try {
            return exameService.incluir(exame, validacao);
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
        log.info("Excluir exame de ID #" + id);
        try {
            exameService.excluir(id);
        }
        catch (ResponseStatusException rsex) {
            throw rsex;
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

    @GetMapping("/total")
    public Integer total() {
        Integer total = exameService.total();
        log.info("Total de exames: " + total);
        return total;
    }

}
