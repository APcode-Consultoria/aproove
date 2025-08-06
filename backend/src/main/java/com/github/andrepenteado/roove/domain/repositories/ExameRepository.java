package com.github.andrepenteado.roove.domain.repositories;

import com.github.andrepenteado.roove.domain.entities.Exame;
import com.github.andrepenteado.roove.domain.entities.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExameRepository extends JpaRepository<Exame, Long> {

    List<Exame> findByPacienteOrderByDescricao(Paciente paciente);

    @Query("SELECT COUNT(*) FROM Exame")
    Integer total();

}
