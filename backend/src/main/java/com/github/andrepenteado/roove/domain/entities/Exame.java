package com.github.andrepenteado.roove.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

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

    @Column(name = "FK_Upload")
    @NotNull(message = "Exame é um campo obrigatório")
    private UUID arquivo;

    private LocalDateTime dataUpload;

    @NotBlank(message = "Descrição é um campo obrigatório")
    private String descricao;

}
