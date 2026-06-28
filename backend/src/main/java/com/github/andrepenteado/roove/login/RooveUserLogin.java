package com.github.andrepenteado.roove.login;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;

// UserLogin do roove com a foto (base64) do usuário. Diferente do controle/equipe (que leem
// a foto do próprio banco), aqui o base64 é obtido da api do apsso via client_credentials.
@Getter @Setter
public class RooveUserLogin extends UserLogin {

    private String fotoBase64;

    public RooveUserLogin(DefaultOidcUser userLogin) {
        super(userLogin);
    }

}
