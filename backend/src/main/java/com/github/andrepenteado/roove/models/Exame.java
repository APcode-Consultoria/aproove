package com.github.andrepenteado.roove.models;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Data
@EqualsAndHashCode(of = { "paciente", "arquivo" })
@ToString(of = { "paciente", "arquivo" })
public class Exame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    @NotNull(message = "Paciente é um campo obrigatório")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "Id_Arquivo")
    @NotNull(message = "Exame é um campo obrigatório")
    private Arquivo arquivo;

    private String descricao;

}
