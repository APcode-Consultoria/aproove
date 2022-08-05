package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.models.Prontuario;
import com.github.andrepenteado.roove.services.ProntuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/prontuarios")
@RequiredArgsConstructor
@Slf4j
public class ProntuarioResource {

    private final ProntuarioService prontuarioService;

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
}
