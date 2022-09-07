package com.github.andrepenteado.roove.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.github.andrepenteado.roove.models.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    List<Paciente> findAllByOrderByNomeAsc();

    Paciente findByCpf(Long cpf);

    @Query("SELECT COUNT(*) FROM Paciente")
    Integer total();

}
