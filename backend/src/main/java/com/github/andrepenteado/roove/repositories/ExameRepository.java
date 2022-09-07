package com.github.andrepenteado.roove.repositories;

import com.github.andrepenteado.roove.models.Exame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExameRepository extends JpaRepository<Exame, Long> {

    List<Exame> findByPacienteIdOrderByDescricao(Long idPaciente);

    @Query("SELECT COUNT(*) FROM Exame")
    Integer total();

}
