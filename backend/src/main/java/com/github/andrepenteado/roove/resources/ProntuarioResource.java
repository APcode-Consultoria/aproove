package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.models.Prontuario;
import com.github.andrepenteado.roove.services.IProntuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/prontuarios")
@RequiredArgsConstructor
@Slf4j
public class ProntuarioResource {

    private final IProntuarioService prontuarioService;

    @GetMapping("/{idPaciente}")
    public List<Prontuario> listarPorPaciente(@PathVariable Long idPaciente) {
        log.info("Listar prontuário do paciente #" + idPaciente);
        try {
            return prontuarioService.listarProntuariosPorPaciente(idPaciente);
        }
        catch (Exception ex) {
            log.error("Erro no processamento", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro no processamento");
        }
    }

    @PostMapping
    public Prontuario incluir(@Valid @RequestBody Prontuario prontuario, BindingResult validacao) {
        log.info("Incluir novo prontuário " + prontuario.toString());
        try {
            return prontuarioService.incluir(prontuario, validacao);
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
        log.info("Excluir prontuário de ID #" + id);
        try {
            prontuarioService.excluir(id);
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
        Integer total = prontuarioService.total();
        log.info("Total de atendimentos: " + total);
        return total;
    }

}
