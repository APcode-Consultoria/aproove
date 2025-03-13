import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { autorizarPerfilGuard } from "@andre.penteado/ngx-apcore";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ autorizarPerfilGuard ],
    data: { perfisAutorizados: [`${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
