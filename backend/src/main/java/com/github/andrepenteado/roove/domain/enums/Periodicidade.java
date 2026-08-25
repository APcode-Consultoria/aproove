/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
package com.github.andrepenteado.roove.domain.enums;

/**
 * Periodicidade com que um serviço se repete.
 *
 * <p>Gravada como texto pelo {@code @Enumerated(EnumType.STRING)} da entidade
 * {@link com.github.andrepenteado.roove.domain.entities.Servico}. Incluir uma constante
 * nova exige alterar o check constraint {@code CK_Servico_Periodicidade} em uma
 * migration própria, porque a que criou a tabela já foi aplicada.</p>
 *
 * <p>É a periodicidade que define o significado de cada valor da coluna
 * {@code frequencia} de {@link com.github.andrepenteado.roove.domain.entities.ServicoContratado}:
 * datas no {@link #AVULSO}, constantes de {@link DiaSemana} no {@link #SEMANAL} e dias
 * do mês no {@link #MENSAL}.</p>
 */
public enum Periodicidade {

    // Sem recorrencia: cada valor da frequencia e uma data especifica, e o atendimento
    // acontece so naquele dia.
    AVULSO("Avulso (Pontual)"),
    SEMANAL("Semanal"),
    MENSAL("Mensal");

    private final String descricao;

    Periodicidade(String descricao) {
        this.descricao = descricao;
    }

    /**
     * Texto exibido na interface para a constante.
     *
     * @return descrição da periodicidade.
     */
    public String getDescricao() {
        return descricao;
    }

}
