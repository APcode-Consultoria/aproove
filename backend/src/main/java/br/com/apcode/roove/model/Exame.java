package br.com.apcode.roove.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;

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
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "Id_Arquivo")
    private Arquivo arquivo;

    private String descricao;

}
