package com.github.andrepenteado.roove;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.util.Arrays;

@SpringBootApplication
public class RooveApplication {

	public static void main(String[] args) {
		SpringApplication.run(RooveApplication.class, args);
	}

	public static String validar(BindingResult validacao) throws Exception {
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

    @Configuration
    public class CorsConfiguration extends WebMvcConfigurationSupport {  
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry
                .addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowCredentials(true);
        }
    }

}
