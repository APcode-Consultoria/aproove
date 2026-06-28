package com.github.andrepenteado.roove.login;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

// Cliente da api de usuários do apsso. Autentica com token client_credentials (a própria
// identidade do backend roove) — o token carrega o scope com.github.andrepenteado.sso.api_CONSULTAR_API.
@Service
@RequiredArgsConstructor
public class UsuarioApiClient {

    private static final String REGISTRATION_ID = "roove-api";

    private final RestClient apiRestClient;

    private final OAuth2AuthorizedClientManager authorizedClientManager;

    // Retorna a foto (base64) do usuário, ou null se o usuário não tiver foto (204 No Content).
    public String buscarFoto(String username) {
        return apiRestClient.get()
            .uri("/v1/usuarios/{username}/foto", username)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + obterToken())
            .retrieve()
            .body(String.class);
    }

    private String obterToken() {
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
            .withClientRegistrationId(REGISTRATION_ID)
            .principal("roove-backend")
            .build();
        OAuth2AuthorizedClient authorizedClient = authorizedClientManager.authorize(authorizeRequest);
        if (authorizedClient == null)
            throw new IllegalStateException("Não foi possível obter token client_credentials para a api");
        return authorizedClient.getAccessToken().getTokenValue();
    }

}
