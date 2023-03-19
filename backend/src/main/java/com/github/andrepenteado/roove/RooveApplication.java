package com.github.andrepenteado.roove;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@SpringBootApplication
public class RooveApplication {

	public static void main(String[] args) {
		SpringApplication.run(RooveApplication.class, args);
	}

	public static String validar(BindingResult validacao) {
        String result = null;
        if (validacao.hasErrors()) {
            var erros = new StringBuilder();
			final StringBuilder errosFinal = erros;
            validacao.getFieldErrors().forEach(msg -> {
                errosFinal.append(msg.getDefaultMessage());
            });
            result = errosFinal.toString();
        }
        return result;
    }

    @Bean
    @Profile("!test")
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authorize) -> {
                    try {
                        authorize
                            .requestMatchers("/home").permitAll()
                            .anyRequest().authenticated()
                            .and()
                            .oauth2Login()
                            .and()
                            .csrf().disable();
                    }
                    catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            );

        return http.build();
    }

}
