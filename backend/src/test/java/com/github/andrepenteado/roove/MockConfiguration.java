package com.github.andrepenteado.roove;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class MockConfiguration {

    public final static String NOME_PACIENTE = "Nome de Paciente de Testes";

    public final static Long CPF_PACIENTE = 12345678901L;

    public static Paciente getPaciente(Long id) {
        Paciente paciente = new Paciente();
        if (id != null)
            paciente.setId(id);
        paciente.setDataCadastro(LocalDateTime.now());
        paciente.setUsuarioCadastro("Arquiteto");
        paciente.setNome(NOME_PACIENTE);
        paciente.setCpf(CPF_PACIENTE);
        paciente.setQueixaPrincipal("Queixa principal NOT NULL");
        paciente.setHistoriaMolestiaPregressa("Histório pregressa NOT NULL");
        return paciente;
    }

    public static OAuth2AuthenticationToken getToken() {
        OidcIdToken idToken = new OidcIdToken(
            "tokenValue",
            Instant.now(),
            Instant.now().plusSeconds(60),
            Map.of(
                "login", "arquiteto",
                "nome", "Arquiteto do Sistema",
                "perfis", Map.of(RooveApplication.PERFIL_FISIOTERAPEUTA, "Fisioterapeuta"))
        );

        DefaultOidcUser oidcUser = new DefaultOidcUser(
            List.of(new SimpleGrantedAuthority(RooveApplication.PERFIL_FISIOTERAPEUTA)),
            idToken,
            "login"
        );

        UserLogin userLogin = new UserLogin(oidcUser);

        return new OAuth2AuthenticationToken(
            userLogin,
            userLogin.getAuthorities(),
            "com.github.andrepenteado.roove"
        );
    }

}
