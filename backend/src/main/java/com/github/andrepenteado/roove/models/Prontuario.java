package com.github.andrepenteado.roove.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(of = { "paciente", "dataRegistro" })
@ToString(of = { "paciente", "dataRegistro" })
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Data do registro é um campo obrigatório")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'.000'")
    private LocalDateTime dataRegistro;

    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    @NotNull(message = "Paciente é um campo obrigatório")
    private Paciente paciente;

    @NotBlank
    private String atendimento;

}
