package com.github.andrepenteado.roove.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.github.andrepenteado.roove.models.Prontuario;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    List<Prontuario> findByPacienteIdOrderByDataRegistroDesc(Long idPaciente);

    @Query("SELECT COUNT(*) FROM Prontuario")
    Integer total();

}
