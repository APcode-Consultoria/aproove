package com.github.andrepenteado.roove;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = { "com.github.andrepenteado.roove", "com.github.andrepenteado.core" })
@EntityScan(basePackages = { "com.github.andrepenteado.roove", "com.github.andrepenteado.core" })
@EnableJpaRepositories(basePackages = { "com.github.andrepenteado.roove", "com.github.andrepenteado.core" })

public class RooveApplication {

	public static final String PERFIL_FISIOTERAPEUTA = "ROLE_com.github.andrepenteado.roove_FISIOTERAPEUTA";

	public static void main(String[] args) {
		SpringApplication.run(RooveApplication.class, args);
	}

}
