package com.github.andrepenteado.roove.repositories;

import com.github.andrepenteado.roove.models.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    List<Prontuario> findByPacienteIdOrderByDataRegistroDesc(Long idPaciente);

}
