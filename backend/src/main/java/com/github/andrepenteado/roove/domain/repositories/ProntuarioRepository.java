package com.github.andrepenteado.roove.domain.repositories;

import com.github.andrepenteado.roove.domain.entities.Paciente;
import com.github.andrepenteado.roove.domain.entities.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    List<Prontuario> findByPacienteOrderByDataRegistroDesc(Paciente paciente);

    @Query("SELECT COUNT(*) FROM Prontuario")
    Integer total();

}
