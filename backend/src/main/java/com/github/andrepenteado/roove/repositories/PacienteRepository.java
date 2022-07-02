package com.github.andrepenteado.roove.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.github.andrepenteado.roove.models.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    Paciente findByCpf(Long cpf);

}
