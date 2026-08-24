/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { PerfilCrud } from "../../config/perfis-crud";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

// Tradução direta de .cruds/paciente.yaml, com a configuração final de cada perfil já
// resolvida — nada fica como regra a interpretar em tempo de execução.
//
// O paciente não tem `tabela.acoes` nem `por-perfil`: as quatro ações e todos os campos
// são iguais para os dois perfis. O que varia é `lista.acoes` de `servicosContratados`,
// onde só o DIRETOR exclui, porque excluir apaga histórico de contratação.
export const PERFIS_PACIENTE: PerfilCrud[] = [
  {
    perfil: `${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`,
    acoes: { consultar: true, incluir: true, alterar: true, excluir: true },
    acoesCustomizadas: {},
    campos: {
      nome:                        { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: true },
      cpf:                         { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: true },
      dataNascimento:              { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      telefone:                    { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: true },
      whatsapp:                    { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      email:                       { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: true },
      contatoEmergencia:           { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      parentescoContatoEmergencia: { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      profissao:                   { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      diaVencimento:               { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      frequenciaSemanal:           { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      responsavel:                 { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: false },
      cep:                         { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      logradouro:                  { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      numeroLogradouro:            { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      complemento:                 { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      bairro:                      { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      cidade:                      { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      estado:                      { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      queixaPrincipal:             { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      historiaMolestiaPregressa:   { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      remedios:                    { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      objetivos:                   { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      observacao:                  { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false }
    },
    listas: {
      exames:              { consultar: true, incluir: true, alterar: true, excluir: true },
      prontuarios:         { consultar: true, incluir: true, alterar: true, excluir: true },
      servicosContratados: { consultar: true, incluir: true, alterar: true, excluir: false }
    }
  },
  {
    perfil: `${PREFIXO_PERFIL_SISTEMA}DIRETOR`,
    acoes: { consultar: true, incluir: true, alterar: true, excluir: true },
    acoesCustomizadas: {},
    campos: {
      nome:                        { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: true },
      cpf:                         { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: true },
      dataNascimento:              { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      telefone:                    { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: true },
      whatsapp:                    { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      email:                       { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: true },
      contatoEmergencia:           { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      parentescoContatoEmergencia: { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      profissao:                   { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      diaVencimento:               { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      frequenciaSemanal:           { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      responsavel:                 { exibeFormulario: true, somenteLeitura: false, exibeGrid: true , exibeTitulo: false, pesquisavel: false },
      cep:                         { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      logradouro:                  { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      numeroLogradouro:            { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      complemento:                 { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      bairro:                      { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      cidade:                      { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      estado:                      { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      queixaPrincipal:             { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      historiaMolestiaPregressa:   { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      remedios:                    { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      objetivos:                   { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false },
      observacao:                  { exibeFormulario: true, somenteLeitura: false, exibeGrid: false, exibeTitulo: false, pesquisavel: false }
    },
    listas: {
      exames:              { consultar: true, incluir: true, alterar: true, excluir: true },
      prontuarios:         { consultar: true, incluir: true, alterar: true, excluir: true },
      servicosContratados: { consultar: true, incluir: true, alterar: true, excluir: true }
    }
  }
];
