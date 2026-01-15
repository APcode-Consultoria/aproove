package com.github.andrepenteado.roove.resources;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.andrepenteado.roove.domain.entities.Prontuario;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.github.andrepenteado.roove.MockConfiguration.getPaciente;
import static com.github.andrepenteado.roove.MockConfiguration.getToken;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
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

    private String getJsonProntuario() throws Exception {
        Prontuario prontuario = new Prontuario();
        prontuario.setDataRegistro(LocalDateTime.now());
        prontuario.setAtendimento(TEXTO_ATENDIMENTO);
        prontuario.setPaciente(getPaciente(300L));
        return objectMapper.writeValueAsString(prontuario);
    }

    @Test
    @DisplayName("Listar prontuários do paciente")
    void testListarPorPaciente() throws Exception {
        String json = mockMvc.perform(get("/prontuarios/300")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        List<Prontuario> lista = objectMapper.readValue(json, new TypeReference<List<Prontuario>>() {});
        assertEquals(2, lista.size());
    }

    @Test
    @DisplayName("Incluir novo prontuário")
    void testIncluir() throws Exception {
        String json = mockMvc.perform(post("/prontuarios")
                .with(authentication(getToken()))
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
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Prontuario())))
            .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @DisplayName("Excluir prontuário existente")
    void testExcluir() throws Exception {
        mockMvc.perform(delete("/prontuarios/1000")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        mockMvc.perform(delete("/prontuarios/9999")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

}
