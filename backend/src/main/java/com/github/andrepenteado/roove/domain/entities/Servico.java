/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.entities;

import jakarta.persistence.Column;
import com.github.andrepenteado.roove.domain.enums.Periodicidade;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Serviço oferecido pela clínica, com o valor cobrado na inscrição.
 *
 * <p>Os campos de auditoria seguem a nomenclatura já adotada pelo projeto
 * ({@code dataCadastro}/{@code usuarioCadastro} e {@code dataUltimaAtualizacao}/
 * {@code usuarioUltimaAtualizacao}), e não os nomes derivados pela spec, para o
 * módulo inteiro falar a mesma língua. Quem os preenche é o
 * {@link com.github.andrepenteado.roove.services.ServicoService}, nunca o resource.</p>
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString(of = "nome")
public class Servico implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataCadastro;

    private LocalDateTime dataUltimaAtualizacao;

    private String usuarioCadastro;

    private String usuarioUltimaAtualizacao;

    @NotBlank(message = "Nome é um campo obrigatório")
    private String nome;

    // BigDecimal com escala 2, nunca double/float: ponto flutuante binario nao
    // representa decimal com exatidao e erra centavo em soma e comparacao.
    @Column(precision = 15, scale = 2)
    private BigDecimal valor;

    private Integer frequenciaPeriodicidade;

    // STRING e nao ORDINAL: o ordinal grava a posicao da constante, e inserir um valor
    // no meio da lista mudaria o significado dos registros ja gravados.
    @Enumerated(EnumType.STRING)
    private Periodicidade periodicidade;

    /**
     * Compara serviços pela chave primária, desembrulhando o proxy do Hibernate antes
     * de confrontar as classes.
     *
     * @param o objeto a comparar.
     * @return {@code true} quando os dois são serviços persistidos com o mesmo ID.
     */
    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Servico servico = (Servico) o;
        return getId() != null && Objects.equals(getId(), servico.getId());
    }

    /**
     * Hash estável para entidade gerenciada, baseado na classe efetiva.
     *
     * @return hash da classe real da entidade, ignorando o proxy do Hibernate.
     */
    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }

}
