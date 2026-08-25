package com.github.andrepenteado.roove.resources;

import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.entities.Servico;
import com.github.andrepenteado.roove.domain.entities.ServicoContratado;
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
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;

import static com.github.andrepenteado.roove.MockConfiguration.getToken;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes da regra "sem choque de horário" (.cruds/paciente.yaml), no resource
 * {@link ServicoContratadoResource}.
 *
 * <p>O dataset deixa a agenda de {@code usuario.teste} com a faixa 08:00–09:00 de toda
 * terça ocupada, a partir de 05/01/2026. Cada teste tenta encaixar uma contratação nova
 * ao redor dessa faixa.</p>
 *
 * <p>O que estes testes protegem: a verificação é sobre as ocorrências derivadas da
 * frequência, não sobre a coluna em si. Uma implementação que comparasse
 * {@code frequencia} e {@code horarios} como texto passaria no caso do choque exato e
 * falharia no da sobreposição parcial — que é o caso comum, o paciente que chega no meio
 * do atendimento anterior.</p>
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
@DatabaseSetup("/datasets/servico-contratado.xml")
@DatabaseTearDown(value = "/datasets/servico-contratado-teardown.xml", type = DatabaseOperation.DELETE_ALL)
@Transactional
@ActiveProfiles("test")
public class ServicoContratadoResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ClientRegistrationRepository clientRegistrationRepository;

    /** Primeira terça-feira coberta pelo dataset. */
    private static final LocalDate INICIO = LocalDate.of(2026, 1, 5);

    /**
     * Monta o payload de uma contratação.
     *
     * <p>Paciente e serviço vão só com o ID: é o que o backend persiste da relação, e é
     * do banco que a regra relê os dois — de propósito, para não verificar o horário com
     * a duração que o navegador mandou.</p>
     */
    private String json(Long idPaciente, Long idServico, String frequencia, String horarios) {
        Paciente paciente = new Paciente();
        paciente.setId(idPaciente);

        Servico servico = new Servico();
        servico.setId(idServico);

        ServicoContratado contratacao = new ServicoContratado();
        contratacao.setPaciente(paciente);
        contratacao.setServico(servico);
        contratacao.setInicioContratacao(INICIO);
        contratacao.setFrequencia(frequencia);
        contratacao.setHorarios(horarios);

        return objectMapper.writeValueAsString(contratacao);
    }

    private String contratar(Long idPaciente, Long idServico, String frequencia, String horarios, int statusEsperado) throws Exception {
        return mockMvc.perform(post("/servicos-contratados")
                .with(authentication(getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(json(idPaciente, idServico, frequencia, horarios)))
            .andExpect(status().is(statusEsperado))
            .andReturn()
            .getResponse()
            .getContentAsString();
    }

    @Test
    @DisplayName("Recusar contratação no mesmo dia e horário de um atendimento já agendado")
    void testRecusarChoqueExato() throws Exception {
        String erro = contratar(501L, 600L, "TERCA", "08:00", 422);

        assertNotNull(erro);
        assertTrue(erro.contains("Choque de horário"), erro);
        // A mensagem precisa dizer com quem é o choque, senão não há o que remarcar.
        assertTrue(erro.contains("Paciente 500"), erro);
    }

    @Test
    @DisplayName("Recusar contratação que começa no meio de um atendimento já agendado")
    void testRecusarSobreposicaoParcial() throws Exception {
        // 08:30 cai dentro da faixa 08:00–09:00: o horário de início não se repete, e é
        // a duração do serviço que denuncia a sobreposição.
        String erro = contratar(501L, 600L, "TERCA", "08:30", 422);

        assertNotNull(erro);
        assertTrue(erro.contains("Choque de horário"), erro);
    }

    @Test
    @DisplayName("Aceitar contratação em horário livre do mesmo dia")
    void testAceitarHorarioLivre() throws Exception {
        // 10:00 é depois das 09:00 em que o atendimento do dataset termina.
        contratar(501L, 600L, "TERCA", "10:00", 200);
    }

    @Test
    @DisplayName("Aceitar contratação em dia da semana livre")
    void testAceitarOutroDiaDaSemana() throws Exception {
        contratar(501L, 600L, "QUINTA", "08:00", 200);
    }

    @Test
    @DisplayName("Aceitar horário ocupado na agenda de outro fisioterapeuta")
    void testAceitarChoqueEmOutraAgenda() throws Exception {
        // O paciente 502 é de `outro.fisioterapeuta`: a faixa das terças às 08:00 está
        // ocupada na agenda de `usuario.teste`, e uma coisa não tem a ver com a outra.
        contratar(502L, 600L, "TERCA", "08:00", 200);
    }

    @Test
    @DisplayName("Recusar contratação cujos próprios horários se sobrepõem")
    void testRecusarChoqueDentroDaPropriaContratacao() throws Exception {
        // Serviço 601 tem frequência 2: os dois controles são preenchidos de uma vez e
        // nada impede escolher a mesma terça duas vezes, com faixas que se cruzam.
        String erro = contratar(501L, 601L, "QUARTA;QUARTA", "08:00;08:30", 422);

        assertNotNull(erro);
        assertTrue(erro.contains("se sobrepõem"), erro);
    }

}
