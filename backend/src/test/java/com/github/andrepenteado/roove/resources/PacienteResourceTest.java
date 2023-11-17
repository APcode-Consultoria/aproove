package com.github.andrepenteado.roove.resources;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.andrepenteado.roove.models.Paciente;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

;

/**
 * Testes do resource {@link com.github.andrepenteado.roove.resources.PacienteResource}
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestExecutionListeners({
    DependencyInjectionTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    DbUnitTestExecutionListener.class
})
@DatabaseSetup("/datasets/paciente.xml")
@Transactional
@ActiveProfiles("test")
public class PacienteResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private final String NOME_PACIENTE = "Nome de Paciente de Testes";

    private final Long CPF_PACIENTE = 12345678901L;

    private Paciente getPaciente(Long id) {
        Paciente paciente = new Paciente();
        if (id != null)
            paciente.setId(id);
        paciente.setDataCadastro(LocalDateTime.now());
        paciente.setNome(NOME_PACIENTE);
        paciente.setCpf(CPF_PACIENTE);
        paciente.setQueixaPrincipal("Queixa principal NOT NULL");
        paciente.setHistoriaMolestiaPregressa("Histório pregressa NOT NULL");
        return paciente;
    }

    private String getJsonPaciente(Long id) throws Exception {
        return objectMapper.writeValueAsString(getPaciente(id));
    }

    @Test
    @DisplayName("Listar todos pacientes")
    void testListar() throws Exception {
        String json = mockMvc.perform(get("/pacientes")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        List<Paciente> lista = objectMapper.readValue(json, new TypeReference<List<Paciente>>() {});
        assertEquals(lista.size(), 3);
    }

    @Test
    @DisplayName("Buscar pacientes por ID")
    void testBuscar() throws Exception {
        mockMvc.perform(get("/pacientes/100")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
        mockMvc.perform(get("/pacientes/999")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Incluir novo paciente")
    void testIncluir() throws Exception {
        String json = mockMvc.perform(post("/pacientes")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(-1L)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        Paciente pacienteNovo = objectMapper.readValue(json, Paciente.class);
        assertEquals(pacienteNovo.getNome(), NOME_PACIENTE);
        assertNotNull(pacienteNovo.getId());

        // Sem dados obrigatórios
        mockMvc.perform(post("/pacientes")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Paciente())))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("do paciente é um campo obrigatório")));

        // CPF duplicado
        mockMvc.perform(post("/pacientes")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(-1L)))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("já se encontra cadastrado")));
    }

    @Test
    @DisplayName("Alterar paciente existente")
    void testAlterar() throws Exception {
        String json = mockMvc.perform(put("/pacientes/100")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(100L)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        Paciente pacienteAlterado = objectMapper.readValue(json, Paciente.class);
        assertEquals(pacienteAlterado.getNome(), NOME_PACIENTE);
        assertEquals(pacienteAlterado.getId(), 100);

        mockMvc.perform(put("/pacientes/999")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(100L)))
            .andExpect(status().isNotFound())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("não encontrado")));

        mockMvc.perform(put("/pacientes/100")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(300L)))
            .andExpect(status().isConflict())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("porém enviado dados do paciente")));

        mockMvc.perform(put("/pacientes/100")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Paciente())))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("do paciente é um campo obrigatório")));
    }

    @Test
    @DisplayName("Excluir paciente existente")
    void testExcluir() throws Exception {
        mockMvc.perform(delete("/pacientes/200")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        /*mockMvc.perform(delete("/pacientes/999")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());*/

        mockMvc.perform(delete("/pacientes/300")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isFound())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("Existe registros no prontuário do paciente")));
    }

}
