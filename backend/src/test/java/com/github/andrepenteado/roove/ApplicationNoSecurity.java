package com.github.andrepenteado.roove;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("test")
public class ApplicationNoSecurity {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests((authorize) -> {
            try {
                authorize
                    .anyRequest().permitAll()
                    .and()
                    .csrf().disable();
            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).build();

    }
}
