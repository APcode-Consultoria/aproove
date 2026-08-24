/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Serviço contratado por um paciente.
 *
 * <p>É a entidade intermediária do N:M entre {@link Paciente} e {@link Servico}, ligada
 * aos dois por {@code @ManyToOne} — nunca {@code @ManyToMany}. Como a lista é
 * {@code persistencia: independente}, a volta ao paciente <b>não</b> leva
 * {@code @JsonIgnore}: o filho é serializado sozinho e precisa carregar o pai, e não há
 * recursão porque o {@code Paciente} não declara a coleção.</p>
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString(of = { "paciente", "servico" })
public class ServicoContratado implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    @NotNull(message = "Paciente é um campo obrigatório")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "FK_Servico")
    @NotNull(message = "Serviço é um campo obrigatório")
    private Servico servico;

    @NotNull(message = "Início da contratação é um campo obrigatório")
    private LocalDate inicioContratacao;

    // Preenchido pelo endpoint de encerrar, nunca digitado no subformulario da aba.
    private LocalDate fimContratacao;

    @Column(precision = 15, scale = 2)
    private BigDecimal valorContratado;

    // Os N valores da frequencia numa coluna so, separados por ponto e virgula. A
    // quantidade e o significado dependem do servico: para MENSAL sao dias do mes
    // (1..31), para QUINZENAL dias da quinzena (1..15) e para SEMANAL dias da semana
    // como inteiro (0 = domingo).
    private String frequencia;

    private LocalDateTime dataCadastro;

    private LocalDateTime dataUltimaAtualizacao;

    private String usuarioCadastro;

    private String usuarioUltimaAtualizacao;

    /**
     * Compara contratações pela chave primária, desembrulhando o proxy do Hibernate.
     *
     * @param o objeto a comparar.
     * @return {@code true} quando as duas são contratações persistidas com o mesmo ID.
     */
    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        ServicoContratado that = (ServicoContratado) o;
        return getId() != null && Objects.equals(getId(), that.getId());
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
