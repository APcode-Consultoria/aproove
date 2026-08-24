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
 */
public enum Periodicidade {

    SEMANAL("Semanal"),
    QUINZENAL("Quinzenal"),
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
