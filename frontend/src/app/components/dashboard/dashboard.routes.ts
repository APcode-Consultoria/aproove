import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { autorizarPerfilGuard } from "@andre.penteado/ngx-apcore";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ autorizarPerfilGuard ],
    data: { perfisAutorizados: [`${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`] }
  }
];
