package com.github.andrepenteado.roove.models;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(of = "nome")
@ToString(of = "nome")
public class Arquivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do arquivo é um campo obrigatório")
    private String nome;

    @NotBlank(message = "Tipo MIME do arquivo é um campo obrigatório")
    private String tipoMime;

    @NotNull(message = "Data de modificação do arquivo é um campo obrigatório")
    private Long modificado;

    @NotNull(message = "Tamanho do arquivo é um campo obrigatório")
    private Long tamanho;

    @NotBlank(message = "Conteúdo do arquivo é um campo obrigatório")
    private String base64;

}
