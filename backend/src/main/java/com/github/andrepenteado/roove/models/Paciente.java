package com.github.andrepenteado.roove.models;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import com.github.andrepenteado.roove.models.enums.Parentesco;

import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(of = { "nome "})
@ToString(of = { "nome "})
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Data de cadastro é um campo obrigatório. ")
    private LocalDateTime dataCadastro;

    @NotNull(message = "Nome do paciente é um campo obrigatório. ")
    private String nome;

    private Long cpf;

    private LocalDateTime dataNascimento;

    private String telefone;

    private Boolean whatsapp;

    private String email;

    private String contatoEmergencia;

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

    private String historiaMolestiaPregressa;

    private String remedios;

    private String objetivos;

}
