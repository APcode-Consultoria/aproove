package com.github.andrepenteado.roove;

import org.dbunit.DatabaseUnitException;
import org.dbunit.database.DatabaseConfig;
import org.dbunit.database.DatabaseDataSourceConnection;
import org.dbunit.ext.postgresql.PostgresqlDataTypeFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
@Profile("test")
public class ApplicationNoSecurity {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authorize) ->
                authorize
                    .anyRequest().permitAll()
            )
            .csrf(CsrfConfigurer::disable)
            .cors(CorsConfigurer::disable);

        return http.build();
    }

    /**
     * Este bean será usado pelo Spring-Test-DBUnit em vez de pegar somente o DataSource,
     * para que o tipo UUID do Postgres (ex.: Upload.UUID) seja reconhecido.
     */
    @Bean(name = "dbUnitDatabaseConnection")
    public DatabaseDataSourceConnection dbUnitDatabaseConnection(DataSource dataSource) throws SQLException, DatabaseUnitException {
        DatabaseDataSourceConnection connection = new DatabaseDataSourceConnection(dataSource);

        DatabaseConfig config = connection.getConfig();
        config.setProperty(
            DatabaseConfig.PROPERTY_DATATYPE_FACTORY,
            new PostgresqlDataTypeFactory()
        );

        return connection;
    }

}
