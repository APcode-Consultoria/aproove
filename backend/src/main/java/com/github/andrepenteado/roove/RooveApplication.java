package com.github.andrepenteado.roove;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.github.andrepenteado.core.web")
public class RooveApplication {

	public static void main(String[] args) {
		SpringApplication.run(RooveApplication.class, args);
	}

}
