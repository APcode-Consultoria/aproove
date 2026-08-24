package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseOperation;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import com.github.springtestdbunit.annotation.DatabaseTearDown;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static com.github.andrepenteado.roove.MockConfiguration.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes do resource {@link com.github.andrepenteado.roove.resources.PacienteResource}
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
// O DbUnit vem antes do listener transacional de proposito: os callbacks "after"
// rodam na ordem inversa da declaracao, entao assim o @DatabaseTearDown so executa
// depois do rollback do teste. Na ordem contraria, apagar uma tabela pai trava
// esperando as linhas filhas ainda nao commitadas pela transacao do teste.
@TestExecutionListeners({
    DependencyInjectionTestExecutionListener.class,
    DbUnitTestExecutionListener.class,
    TransactionalTestExecutionListener.class
})
@DatabaseSetup("/datasets/paciente.xml")
@DatabaseTearDown(value = "/datasets/paciente-teardown.xml", type = DatabaseOperation.DELETE_ALL)
@Transactional
@ActiveProfiles("test")
public class PacienteResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ClientRegistrationRepository clientRegistrationRepository;

    private String getJsonPaciente(Long id) throws Exception {
        return objectMapper.writeValueAsString(getPaciente(id));
    }

    @Test
    @DisplayName("Listar todos pacientes")
    void testListar() throws Exception {
        String json = mockMvc.perform(get("/pacientes")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        List<Paciente> lista = objectMapper.readValue(json, new TypeReference<List<Paciente>>() {});
        assertEquals(3, lista.size());
    }

    @Test
    @DisplayName("Buscar pacientes por ID")
    void testBuscar() throws Exception {
        mockMvc.perform(get("/pacientes/100")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
        mockMvc.perform(get("/pacientes/999")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Incluir novo paciente")
    void testIncluir() throws Exception {
        String json = mockMvc.perform(post("/pacientes")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(-1L)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        Paciente pacienteNovo = objectMapper.readValue(json, Paciente.class);
        assertEquals(NOME_PACIENTE, pacienteNovo.getNome());
        assertNotNull(pacienteNovo.getId());

        // Sem dados obrigatórios
        mockMvc.perform(post("/pacientes")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Paciente())))
            .andExpect(status().isUnprocessableContent())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("é um campo obrigatório")));

        // CPF duplicado
        mockMvc.perform(post("/pacientes")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(-1L)))
            .andExpect(status().isUnprocessableContent())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("já se encontra cadastrado")));
    }

    @Test
    @DisplayName("Preservar zero à esquerda de CPF, CEP e telefone")
    void testPreservarZeroAEsquerda() throws Exception {
        // CPF, CEP e telefone eram BIGINT: o zero à esquerda se perdia na gravação e o
        // valor voltava curto demais para a máscara da tela, que passava a recusar o
        // Gravar do paciente com a mensagem genérica de dados obrigatórios.
        Paciente paciente = getPaciente(null);
        paciente.setCpf("01234567890");
        paciente.setCep("01310100");
        paciente.setTelefone("1133334444");

        String json = mockMvc.perform(post("/pacientes")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paciente)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        Paciente pacienteGravado = objectMapper.readValue(json, Paciente.class);
        assertEquals("01234567890", pacienteGravado.getCpf());
        assertEquals("01310100", pacienteGravado.getCep());
        assertEquals("1133334444", pacienteGravado.getTelefone());
    }

    @Test
    @DisplayName("Alterar paciente existente")
    void testAlterar() throws Exception {
        String json = mockMvc.perform(put("/pacientes/100")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(100L)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        Paciente pacienteAlterado = objectMapper.readValue(json, Paciente.class);
        assertEquals(NOME_PACIENTE, pacienteAlterado.getNome());
        assertEquals(100, pacienteAlterado.getId());

        mockMvc.perform(put("/pacientes/999")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(100L)))
            .andExpect(status().isNotFound());
//            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("não encontrado")));

        mockMvc.perform(put("/pacientes/100")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(getJsonPaciente(300L)))
            .andExpect(status().isConflict())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("porém enviado dados do paciente")));

        mockMvc.perform(put("/pacientes/100")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Paciente())))
            .andExpect(status().isUnprocessableContent())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("é um campo obrigatório")));
    }

    @Test
    @DisplayName("Excluir paciente existente")
    void testExcluir() throws Exception {
        mockMvc.perform(delete("/pacientes/200")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        mockMvc.perform(delete("/pacientes/999")
            .with(authentication(getToken()))
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());

        mockMvc.perform(delete("/pacientes/300")
                .with(authentication(getToken()))
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isFound())
            .andExpect(ex -> assertTrue(ex.getResolvedException().getMessage().contains("Existe registros no prontuário do paciente")));
    }

}
