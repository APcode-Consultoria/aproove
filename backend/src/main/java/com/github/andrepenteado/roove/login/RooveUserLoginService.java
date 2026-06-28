package com.github.andrepenteado.roove.login;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import br.unesp.fc.andrepenteado.core.web.services.UserLoginOidcService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.stereotype.Service;

// Sobrescreve o serviço de login do apcore para anexar a foto do usuário, obtida da api do apsso.
@Primary
@Service
@RequiredArgsConstructor
@Slf4j
public class RooveUserLoginService extends UserLoginOidcService {

    private final UsuarioApiClient usuarioApiClient;

    @Override
    protected UserLogin criarUsuario(DefaultOidcUser oidcUser) {
        return new RooveUserLogin(oidcUser);
    }

    @Override
    protected void posProcessar(UserLogin userLogin) {
        RooveUserLogin rooveUserLogin = (RooveUserLogin) userLogin;
        try {
            rooveUserLogin.setFotoBase64(usuarioApiClient.buscarFoto(rooveUserLogin.getLogin()));
        }
        catch (Exception ex) {
            // A foto é opcional: se a api estiver indisponível/sem permissão, o login segue sem avatar.
            log.warn("Não foi possível obter a foto do usuário {} via api do apsso: {}",
                rooveUserLogin.getLogin(), ex.getMessage());
        }
    }

}
