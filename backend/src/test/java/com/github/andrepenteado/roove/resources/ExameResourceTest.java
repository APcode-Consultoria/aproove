package com.github.andrepenteado.roove.resources;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.andrepenteado.roove.domain.entities.Exame;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseOperation;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import com.github.springtestdbunit.annotation.DatabaseTearDown;
import com.github.springtestdbunit.annotation.DbUnitConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.UUID;

import static com.github.andrepenteado.roove.MockConfiguration.getPaciente;
import static com.github.andrepenteado.roove.MockConfiguration.getToken;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes do resource {@link ExameResource}
 */
/*@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestExecutionListeners({
    DependencyInjectionTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    DbUnitTestExecutionListener.class
})
@DbUnitConfiguration(databaseConnection = "dbUnitDatabaseConnection")
@DatabaseSetup(
    value = "/datasets/exame.xml",
    type  = DatabaseOperation.CLEAN_INSERT
)
@DatabaseTearDown(
    value = "/datasets/exame.xml",
    type  = DatabaseOperation.DELETE_ALL
)
@Transactional
@ActiveProfiles("test")*/
public class ExameResourceTest {

    /*@Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private final String DESCRICAO_EXAME = "Descricao do exame de testes";

    private String getJsonExame() throws Exception {
        Exame exame = new Exame();
        exame.setPaciente(getPaciente(100L));
        exame.setArquivo(UUID.fromString("00000000-0000-0000-0000-000000000003"));
        exame.setDescricao(DESCRICAO_EXAME);
        exame.setDataUpload(LocalDateTime.now());
        return objectMapper.writeValueAsString(exame);
    }

    @Test
    @DisplayName("Listar exames do paciente")
    void testListarPorPaciente() throws Exception {
        String json = mockMvc.perform(get("/exames/100")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        List<Exame> lista = objectMapper.readValue(json, new TypeReference<List<Exame>>() {});
        assertEquals(2, lista.size());
    }

    @Test
    @DisplayName("Incluir novo exame")
    void testIncluir() throws Exception {
        String json = mockMvc.perform(post("/exames")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonExame()))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        Exame exameNovo = objectMapper.readValue(json, Exame.class);
        assertEquals(exameNovo.getDescricao(), DESCRICAO_EXAME);
        assertNotNull(exameNovo.getId());

        // Sem dados obrigatórios
        mockMvc.perform(post("/exames")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Exame())))
            .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @DisplayName("Excluir exame existente")
    void testExcluir() throws Exception {
        mockMvc.perform(delete("/exames/1000")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        mockMvc.perform(delete("/exames/9999")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }*/

}
