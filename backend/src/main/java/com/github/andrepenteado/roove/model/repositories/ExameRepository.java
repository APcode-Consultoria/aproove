package com.github.andrepenteado.roove.model.repositories;

import com.github.andrepenteado.roove.model.entities.Exame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExameRepository extends JpaRepository<Exame, Long> {

    List<Exame> findByPacienteIdOrderByDescricao(Long idPaciente);

    @Query("SELECT COUNT(*) FROM Exame")
    Integer total();

}
