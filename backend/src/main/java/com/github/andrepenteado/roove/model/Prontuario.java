package com.github.andrepenteado.roove.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(of = { "paciente", "registro" })
@ToString(of = { "paciente", "registro" })
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime registro;

    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    private Paciente paciente;

    private String atendimento;

}
