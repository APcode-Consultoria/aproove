package com.github.andrepenteado.roove.domain.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.github.andrepenteado.roove.domain.enums.Parentesco;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.proxy.HibernateProxy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString(of = "nome")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime dataCadastro;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime dataUltimaAtualizacao;

    private String usuarioCadastro;

    private String usuarioUltimaAtualizacao;

    @NotNull(message = "Nome é um campo obrigatório")
    private String nome;

    @NotNull(message = "CPF é um campo obrigatório")
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

    private String complemento;

    private Integer numeroLogradouro;

    private String bairro;

    private String cidade;

    private String estado;

    private String profissao;

    private Integer diaVencimento;

    private Integer frequenciaSemanal;

    @NotNull(message = "Queixa principal (QP) é um campo obrigatório")
    private String queixaPrincipal;

    @NotNull(message = "História Moléstia Pregressa (HMP) é um campo obrigatório")
    private String historiaMolestiaPregressa;

    private String remedios;

    private String objetivos;

    @NotNull(message = "Responsável é um campo obrigatório")
    private String responsavel;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Paciente paciente = (Paciente) o;
        return getId() != null && Objects.equals(getId(), paciente.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
