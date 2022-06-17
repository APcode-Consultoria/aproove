package com.github.andrepenteado.roove.models;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(of = { "paciente", "registro" })
@ToString(of = { "paciente", "registro" })
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Data do registro é um campo obrigatório")
    private LocalDateTime dataRegistro;

    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    @NotNull(message = "Paciente é um campo obrigatório")
    private Paciente paciente;

    private String atendimento;

}
