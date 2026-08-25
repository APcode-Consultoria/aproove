/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { Routes } from '@angular/router';

import { PesquisarComponent } from './pesquisar/pesquisar.component';
import { autorizarPerfilGuard } from "@andre.penteado/ngx-apcore";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

// Escritas à mão, e não com `crudRoutes()`: a tela é somente leitura e não tem
// cadastro, então as 3 rotas padrão não se aplicam. O guard e o `data` seguem o mesmo
// formato que `crudRoutes()` monta.
export const pagamentoRoutes: Routes = [

  { path: '', redirectTo: 'pesquisar', pathMatch: 'full' },

  {
    path: 'pesquisar',
    component: PesquisarComponent,
    canActivate: [autorizarPerfilGuard],
    data: { perfisAutorizados: [`${PREFIXO_PERFIL_SISTEMA}DIRETOR`] }
  }

];
