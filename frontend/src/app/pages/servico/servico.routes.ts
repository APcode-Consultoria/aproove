/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { Routes } from '@angular/router';

import { PesquisarComponent } from './pesquisar/pesquisar.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { crudRoutes } from "@andre.penteado/ngx-apcore";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

export const servicoRoutes: Routes = crudRoutes(PesquisarComponent, CadastroComponent, {
  perfisAutorizados: [`${PREFIXO_PERFIL_SISTEMA}DIRETOR`]
});
