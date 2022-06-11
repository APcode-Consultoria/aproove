package com.github.andrepenteado.roove.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(of = { "nome "})
@ToString(of = { "nome "})
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDateTime cadastro;

    @NotNull
    private String nome;

    private Long cpf;

    private LocalDateTime nascimento;

    private Long cep;

    private String rua;

    private Integer numero;

    private String bairro;

    private String cidade;

    private String estado;

    private String profissao;

    private LocalDateTime vencimento;

    private Integer frequencia;

    private String queixa;

    private String remedios;

    private String objetivos;

}
