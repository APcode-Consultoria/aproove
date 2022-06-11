package com.github.andrepenteado.roove;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.validation.BindingResult;

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

}
