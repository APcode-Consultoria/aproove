import { Routes } from '@angular/router';

import { PesquisarComponent } from './pesquisar/pesquisar.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { crudRoutes } from "@andre.penteado/ngx-apcore";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

export const pacienteRoutes: Routes = crudRoutes(PesquisarComponent, CadastroComponent, {
  perfisAutorizados: [`${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`]
});
