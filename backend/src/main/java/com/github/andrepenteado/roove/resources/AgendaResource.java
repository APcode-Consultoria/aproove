/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.agenda.AgendaAtendimento;
import com.github.andrepenteado.roove.services.AgendaService;
import io.micrometer.observation.annotation.Observed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * Endpoint da agenda de atendimentos.
 *
 * <p>Não é CRUD: a agenda é derivada das contratações em aberto e não tem tabela, então
 * só existe a consulta.</p>
 */
@RestController
@RequestMapping("/agenda")
@RequiredArgsConstructor
@Observed
@Slf4j
public class AgendaResource {

    private final AgendaService agendaService;

    /**
     * Consulta a agenda de um fisioterapeuta no período.
     *
     * @param responsavel login do fisioterapeuta; omitido assume o usuário logado, e
     *                    quem não é DIRETOR sempre vê a própria agenda.
     * @param inicio primeiro dia do período.
     * @param fim último dia do período.
     * @return atendimentos ordenados por data e horário.
     */
    @GetMapping
    public List<AgendaAtendimento> listar(
        @RequestParam(required = false) String responsavel,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) {
        log.info("Consultar agenda entre {} e {}", inicio, fim);
        return agendaService.listar(responsavel, inicio, fim);
    }

}
