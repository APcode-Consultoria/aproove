/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { LoginService } from "@andre.penteado/ngx-apcore";

/**
 * Ações de uma lista e os perfis que executam cada uma: tradução literal de
 * `lista.acoes` do YAML.
 */
export interface AcoesLista {
  consultar: string[];
  incluir: string[];
  alterar: string[];
  excluir: string[];
}

/** As mesmas quatro ações, já resolvidas para o usuário logado. */
export interface AcoesPermitidas {
  consultar: boolean;
  incluir: boolean;
  alterar: boolean;
  excluir: boolean;
}

/** O que o usuário logado pode fazer nas listas do CRUD. */
export interface ConfigCrud {
  listas: Record<string, AcoesPermitidas>;
}

/**
 * Resolve as ações das listas para o usuário logado.
 *
 * <p>Perfis somam permissões: a ação existe quando o usuário tem <b>qualquer</b> um dos
 * perfis declarados para ela — que é exatamente o `hasAnyRole` do LoginService, e não
 * um laço próprio.</p>
 *
 * <p>Só existe a fatia `listas` porque `lista.acoes` é a única configuração por perfil
 * que os YAMLs deste projeto declaram. Nenhum deles tem `tabela.acoes`,
 * `tabela.acoes-customizadas`, `por-perfil` ou `edicao`, e gerar mapas de ações e de
 * campos com valores idênticos para todos os perfis era carregar 200 linhas para
 * transportar dois booleanos. Quando um CRUD declarar uma dessas, a fatia
 * correspondente entra aqui — a regra está em 06-frontend-rotas-menu-api.md.</p>
 *
 * @param listas ações declaradas para cada lista do CRUD.
 * @param loginService serviço de login, fonte dos perfis do usuário.
 * @return as ações de cada lista já reduzidas a booleanos.
 */
export function resolverPerfil(listas: Record<string, AcoesLista>, loginService: LoginService): ConfigCrud {
  const resolvidas: Record<string, AcoesPermitidas> = {};

  for (const [nome, acoes] of Object.entries(listas)) {
    resolvidas[nome] = {
      consultar: loginService.hasAnyRole(acoes.consultar),
      incluir: loginService.hasAnyRole(acoes.incluir),
      alterar: loginService.hasAnyRole(acoes.alterar),
      excluir: loginService.hasAnyRole(acoes.excluir)
    };
  }

  return { listas: resolvidas };
}
