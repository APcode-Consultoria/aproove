package com.github.andrepenteado.roove;

import br.unesp.fc.andrepenteado.core.upload.Upload;
import br.unesp.fc.andrepenteado.core.upload.UploadRepository;
import br.unesp.fc.andrepenteado.core.upload.UploadResource;
import br.unesp.fc.andrepenteado.core.web.config.CorsConfig;
import br.unesp.fc.andrepenteado.core.web.config.SecurityConfig;
import br.unesp.fc.andrepenteado.core.web.resources.AuthResource;
import br.unesp.fc.andrepenteado.core.web.services.UserLoginOAuth2Service;
import br.unesp.fc.andrepenteado.core.web.services.UserLoginOidcService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(
	scanBasePackages = {
		"com.github.andrepenteado.roove"
	},
	scanBasePackageClasses = {
		SecurityConfig.class,
		AuthResource.class,
		UserLoginOAuth2Service.class,
		UserLoginOidcService.class,
		CorsConfig.class,
		UploadResource.class
	}
)
@EntityScan(
	basePackages = {
		"com.github.andrepenteado.roove"
	},
	basePackageClasses = {
		Upload.class
	}
)
@EnableJpaRepositories(
	basePackages = {
		"com.github.andrepenteado.roove"
	},
	basePackageClasses = {
		UploadRepository.class
	}
)
public class RooveApplication {

	public static final String PERFIL_FISIOTERAPEUTA = "ROLE_com.github.andrepenteado.roove_FISIOTERAPEUTA";

	public static void main(String[] args) {
		SpringApplication.run(RooveApplication.class, args);
	}

}
