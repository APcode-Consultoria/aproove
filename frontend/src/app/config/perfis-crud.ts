/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { LoginService } from "@andre.penteado/ngx-apcore";

/** Ações de CRUD liberadas para o usuário logado. */
export interface AcoesCrud {
  consultar: boolean;
  incluir: boolean;
  alterar: boolean;
  excluir: boolean;
}

/** Configuração de um campo para o usuário logado. */
export interface ConfigCampo {
  exibeFormulario: boolean;
  somenteLeitura: boolean;
  exibeGrid: boolean;
  exibeTitulo: boolean;
  pesquisavel: boolean;
}

/** O que um perfil vê e pode fazer no CRUD. Uma entrada por perfil de `projeto.perfis`. */
export interface PerfilCrud {
  perfil: string;
  acoes: AcoesCrud;
  acoesCustomizadas: Record<string, boolean>;
  campos: Record<string, ConfigCampo>;
  listas: Record<string, AcoesCrud>;
}

/** Resultado da combinação dos perfis que o usuário logado possui. */
export interface ConfigCrud {
  acoes: AcoesCrud;
  acoesCustomizadas: Record<string, boolean>;
  campos: Record<string, ConfigCampo>;
  listas: Record<string, AcoesCrud>;
}

const SEM_ACAO: AcoesCrud = { consultar: false, incluir: false, alterar: false, excluir: false };

const CAMPO_OCULTO: ConfigCampo = {
  exibeFormulario: false,
  somenteLeitura: true,
  exibeGrid: false,
  exibeTitulo: false,
  pesquisavel: false
};

/**
 * Combina os perfis do CRUD que o usuário logado possui. Perfis somam permissões: a ação existe
 * se qualquer perfil dele tiver, o campo aparece se qualquer perfil dele exibir, e o campo só é
 * somente leitura quando nenhum perfil dele está no `edicao` do campo.
 *
 * O mapa devolvido tem entrada para todos os campos e listas do CRUD, então consultar um nome
 * nunca devolve `undefined`.
 */
export function resolverPerfil(perfis: PerfilCrud[], loginService: LoginService): ConfigCrud {
  const meus = perfis.filter(perfilCrud => loginService.hasRole(perfilCrud.perfil));

  if (meus.length === 0) {
    console.warn("Nenhum perfil do CRUD corresponde ao usuário logado: a tela ficará sem ações e sem campos");
  }

  const nomesCampos = new Set(perfis.flatMap(perfilCrud => Object.keys(perfilCrud.campos)));
  const nomesListas = new Set(perfis.flatMap(perfilCrud => Object.keys(perfilCrud.listas)));

  const campos: Record<string, ConfigCampo> = {};
  for (const nome of nomesCampos) {
    const configs = meus.map(perfilCrud => perfilCrud.campos[nome] ?? CAMPO_OCULTO);
    const noFormulario = configs.filter(config => config.exibeFormulario);

    campos[nome] = {
      exibeFormulario: noFormulario.length > 0,
      somenteLeitura: noFormulario.length === 0 || noFormulario.every(config => config.somenteLeitura),
      exibeGrid: configs.some(config => config.exibeGrid),
      exibeTitulo: configs.some(config => config.exibeTitulo),
      pesquisavel: configs.some(config => config.pesquisavel)
    };
  }

  const listas: Record<string, AcoesCrud> = {};
  for (const nome of nomesListas) {
    listas[nome] = somarAcoes(meus.map(perfilCrud => perfilCrud.listas[nome] ?? SEM_ACAO));
  }

  const nomesCustomizadas = new Set(perfis.flatMap(perfilCrud => Object.keys(perfilCrud.acoesCustomizadas)));
  const acoesCustomizadas: Record<string, boolean> = {};
  for (const nome of nomesCustomizadas) {
    acoesCustomizadas[nome] = meus.some(perfilCrud => perfilCrud.acoesCustomizadas[nome] === true);
  }

  return {
    acoes: somarAcoes(meus.map(perfilCrud => perfilCrud.acoes)),
    acoesCustomizadas,
    campos,
    listas
  };
}

function somarAcoes(acoes: AcoesCrud[]): AcoesCrud {
  return {
    consultar: acoes.some(acao => acao.consultar),
    incluir: acoes.some(acao => acao.incluir),
    alterar: acoes.some(acao => acao.alterar),
    excluir: acoes.some(acao => acao.excluir)
  };
}
