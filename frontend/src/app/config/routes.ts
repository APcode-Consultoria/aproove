import { Routes } from "@angular/router"
import { AcessoNegadoComponent, ErroProcessamentoComponent, PaginaInicialComponent } from "@andre.penteado/ngx-apcore"

export const DECORATED_ROUTES: Routes = [

  { path: "", component: PaginaInicialComponent },

  {
    path: "pagina-inicial",
    component: PaginaInicialComponent
  },

  { path: 'dashboard', loadChildren: () => import('../components/dashboard/dashboard.routes').then(m => m.dashboardRoutes) },

  { path: 'paciente', loadChildren: () => import('../components/paciente/paciente.routes').then(m => m.pacienteRoutes) }

]

export const NO_DECORATED_ROUTES: Routes = [

  { path: "erro-processamento", component: ErroProcessamentoComponent },

  { path: "acesso-negado", component: AcessoNegadoComponent }

]
