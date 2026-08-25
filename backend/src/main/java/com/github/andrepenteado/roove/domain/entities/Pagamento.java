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
 * Pagamento de uma contratação de serviço.
 *
 * <p>Nasce junto com o {@link ServicoContratado} e, a cada quitação, gera o próximo
 * enquanto a contratação estiver em aberto. Como a lista é
 * {@code persistencia: independente}, a volta ao paciente não leva {@code @JsonIgnore}:
 * o pagamento é serializado sozinho e o {@code Paciente} não declara a coleção.</p>
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString(of = { "servicoContratado", "dataVencimento" })
public class Pagamento implements Serializable {

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
    @JoinColumn(name = "FK_Servico_Contratado")
    @NotNull(message = "Contratação é um campo obrigatório")
    private ServicoContratado servicoContratado;

    @NotNull(message = "Vencimento é um campo obrigatório")
    private LocalDate dataVencimento;

    @Column(precision = 15, scale = 2)
    private BigDecimal valor;

    private LocalDate dataPagamento;

    @Column(precision = 15, scale = 2)
    private BigDecimal valorPago;

    private LocalDateTime dataCadastro;

    private LocalDateTime dataUltimaAtualizacao;

    private String usuarioCadastro;

    private String usuarioUltimaAtualizacao;

    /**
     * Indica se o pagamento já foi quitado.
     *
     * @return {@code true} quando data e valor pagos estão preenchidos.
     */
    public boolean isPago() {
        return Objects.nonNull(dataPagamento) && Objects.nonNull(valorPago);
    }

    /**
     * Compara pagamentos pela chave primária, desembrulhando o proxy do Hibernate.
     *
     * @param o objeto a comparar.
     * @return {@code true} quando os dois são pagamentos persistidos com o mesmo ID.
     */
    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Pagamento pagamento = (Pagamento) o;
        return getId() != null && Objects.equals(getId(), pagamento.getId());
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
