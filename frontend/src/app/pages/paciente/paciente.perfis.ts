/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { AcoesLista } from "../../config/perfis-crud";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

const FISIOTERAPEUTA = `${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`;
const DIRETOR = `${PREFIXO_PERFIL_SISTEMA}DIRETOR`;

// Tradução literal de `lista.acoes` em .cruds/paciente.yaml, e nada além disso: é a
// única configuração por perfil que aquele YAML declara. As quatro ações da tabela e
// todos os campos são iguais para os dois perfis, então não há `tabela.acoes` nem
// `por-perfil` a traduzir — o que varia é só quem exclui contratação e pagamento,
// porque excluir apaga histórico.
//
// `exames` e `prontuarios` não aparecem porque não declaram `acoes` no YAML: quem abre
// a tela pode tudo neles.
export const ACOES_LISTAS_PACIENTE: Record<string, AcoesLista> = {
  servicosContratados: {
    consultar: [FISIOTERAPEUTA, DIRETOR],
    incluir:   [FISIOTERAPEUTA, DIRETOR],
    alterar:   [FISIOTERAPEUTA, DIRETOR],
    excluir:   [DIRETOR]
  },
  pagamentos: {
    consultar: [FISIOTERAPEUTA, DIRETOR],
    incluir:   [FISIOTERAPEUTA, DIRETOR],
    alterar:   [FISIOTERAPEUTA, DIRETOR],
    excluir:   [DIRETOR]
  }
};
