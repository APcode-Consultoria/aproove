package com.github.andrepenteado.roove.models;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Data
@EqualsAndHashCode(of = { "nome" })
@ToString(of = { "nome" })
public class Arquivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do arquivo é um campo obrigatório")
    private String nome;

    @NotBlank(message = "Tipo do arquivo é um campo obrigatório")
    private String tipo;

    @NotBlank(message = "Conteúdo do arquivo é um campo obrigatório")
    private byte[] conteudo;

}
