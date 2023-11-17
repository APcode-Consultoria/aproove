package com.github.andrepenteado.roove.resources;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.andrepenteado.roove.models.Paciente;
import com.github.andrepenteado.roove.models.Prontuario;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes do resource {@link com.github.andrepenteado.roove.resources.ProntuarioResource}
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestExecutionListeners({
        DependencyInjectionTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        DbUnitTestExecutionListener.class
})
@DatabaseSetup("/datasets/prontuario.xml")
@Transactional
@ActiveProfiles("test")
public class ProntuarioResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private final String TEXTO_ATENDIMENTO = "Atendimento de testes";

    private Paciente getPaciente() {
        Paciente paciente = new Paciente();
        paciente.setId(100L);
        paciente.setDataCadastro(LocalDateTime.now());
        paciente.setNome("Paciente com prontuário");
        paciente.setCpf(99999999999L);
        paciente.setQueixaPrincipal("Queixa principal NOT NULL");
        paciente.setHistoriaMolestiaPregressa("Histório pregressa NOT NULL");
        return paciente;
    }

    private String getJsonProntuario() throws Exception {
        Prontuario prontuario = new Prontuario();
        prontuario.setDataRegistro(LocalDateTime.now());
        prontuario.setAtendimento(TEXTO_ATENDIMENTO);
        prontuario.setPaciente(getPaciente());
        return objectMapper.writeValueAsString(prontuario);
    }

    @Test
    @DisplayName("Listar prontuários do paciente")
    void testListarPorPaciente() throws Exception {
        String json = mockMvc.perform(get("/prontuarios/100")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        List<Prontuario> lista = objectMapper.readValue(json, new TypeReference<List<Prontuario>>() {});
        assertEquals(lista.size(), 2);
    }

    @Test
    @DisplayName("Incluir novo prontuário")
    void testIncluir() throws Exception {
        String json = mockMvc.perform(post("/prontuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonProntuario()))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        Prontuario prontuarioNovo = objectMapper.readValue(json, Prontuario.class);
        assertEquals(prontuarioNovo.getAtendimento(), TEXTO_ATENDIMENTO);
        assertNotNull(prontuarioNovo.getId());

        // Sem dados obrigatórios
        mockMvc.perform(post("/prontuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Prontuario())))
            .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @DisplayName("Excluir prontuário existente")
    void testExcluir() throws Exception {
        mockMvc.perform(delete("/prontuarios/1000")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        /*mockMvc.perform(delete("/prontuarios/9999")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());*/
    }

}
