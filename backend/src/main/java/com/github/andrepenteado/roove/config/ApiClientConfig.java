package com.github.andrepenteado.roove.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.web.client.RestClient;

import java.time.Duration;

// Infra para o backend do roove consultar a api do apsso via OAuth2 client_credentials (M2M).
@Configuration
public class ApiClientConfig {

    // Gerencia o token de máquina (client_credentials). Usa o AuthorizedClientService (e não o
    // gerenciador atrelado ao request) porque o token representa a aplicação, não um usuário.
    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository) {
        // Serviço próprio (in-memory) em vez de depender de um bean auto-configurado, já que o
        // apcore fornece um ClientRegistrationRepository custom (PkceOAuth2ClientConfig).
        OAuth2AuthorizedClientService authorizedClientService =
            new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository);
        OAuth2AuthorizedClientProvider provider = OAuth2AuthorizedClientProviderBuilder.builder()
            .clientCredentials()
            .build();
        AuthorizedClientServiceOAuth2AuthorizedClientManager manager =
            new AuthorizedClientServiceOAuth2AuthorizedClientManager(clientRegistrationRepository, authorizedClientService);
        manager.setAuthorizedClientProvider(provider);
        return manager;
    }

    // RestClient dedicado à api, com timeouts curtos: a foto é "nice to have" e não pode travar o login.
    @Bean
    public RestClient apiRestClient(@Value("${apsso.api.base-url}") String baseUrl) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(3));
        requestFactory.setReadTimeout(Duration.ofSeconds(5));
        return RestClient.builder()
            .baseUrl(baseUrl)
            .requestFactory(requestFactory)
            .build();
    }

}
