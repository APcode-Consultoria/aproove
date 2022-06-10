package br.com.apcode.roove.resources;

import br.com.apcode.roove.model.Paciente;
import br.com.apcode.roove.repositories.PacienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
@Slf4j public class PacienteResource {

    private final PacienteRepository pacienteRepository;

    @GetMapping("/{id}")
    public Paciente buscarPaciente(@PathVariable Long id) {
        log.info("Buscar paciente: " + id);
        return pacienteRepository.findById(id).orElseThrow();
    }

}
