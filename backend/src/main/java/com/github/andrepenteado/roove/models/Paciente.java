package com.github.andrepenteado.roove.models;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.github.andrepenteado.roove.models.enums.Parentesco;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(of = "nome")
@ToString(of = "nome")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'.000'")
    private LocalDateTime dataCadastro;

    @NotNull(message = "Nome do paciente é um campo obrigatório. ")
    private String nome;

    @NotNull(message = "CPF do paciente é um campo obrigatório. ")
    private Long cpf;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataNascimento;

    private Long telefone;

    private Boolean whatsapp;

    private String email;

    private String contatoEmergencia;

    @Enumerated(EnumType.STRING)
    private Parentesco parentescoContatoEmergencia;

    private Long cep;

    private String logradouro;

    private Integer numeroLogradouro;

    private String bairro;

    private String cidade;

    private String estado;

    private String profissao;

    private Integer diaVencimento;

    private Integer frequenciaSemanal;

    @NotNull(message = "Queixa principal (QP) do paciente é um campo obrigatório. ")
    private String queixaPrincipal;

    @NotNull(message = "História Moléstia Pregressa do paciente é um campo obrigatório. ")
    private String historiaMolestiaPregressa;

    private String remedios;

    private String objetivos;

}
