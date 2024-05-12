package com.github.andrepenteado.roove;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = { "com.github.andrepenteado.roove", "com.github.andrepenteado.core.web" })
public class RooveApplication {

	public static final String PERFIL_FISIOTERAPEUTA = "ROLE_com.github.andrepenteado.roove_FISIOTERAPEUTA";

	public static void main(String[] args) {
		SpringApplication.run(RooveApplication.class, args);
	}

}
