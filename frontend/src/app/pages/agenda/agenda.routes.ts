/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { Routes } from '@angular/router';

import { AgendaComponent } from './agenda.component';
import { autorizarPerfilGuard } from "@andre.penteado/ngx-apcore";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

// Tela única, sem cadastro: `crudRoutes()` não se aplica. O guard e o `data` seguem o
// mesmo formato que ele monta.
export const agendaRoutes: Routes = [

  {
    path: '',
    component: AgendaComponent,
    canActivate: [autorizarPerfilGuard],
    data: { perfisAutorizados: [`${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`] }
  }

];
