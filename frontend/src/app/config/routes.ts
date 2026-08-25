import { Routes } from "@angular/router"
import { AcessoNegadoComponent, ErroProcessamentoComponent, PaginaInicialComponent } from "@andre.penteado/ngx-apcore"

export const DECORATED_ROUTES: Routes = [

  { path: "", component: PaginaInicialComponent },

  {
    path: "pagina-inicial",
    component: PaginaInicialComponent
  },

  { path: 'dashboard', loadChildren: () => import('../pages/dashboard/dashboard.routes').then(m => m.dashboardRoutes) },

  { path: 'paciente', loadChildren: () => import('../pages/paciente/paciente.routes').then(m => m.pacienteRoutes) },

  { path: 'servico', loadChildren: () => import('../pages/servico/servico.routes').then(m => m.servicoRoutes) },

  { path: 'pagamento', loadChildren: () => import('../pages/pagamento/pagamento.routes').then(m => m.pagamentoRoutes) },

  { path: 'agenda', loadChildren: () => import('../pages/agenda/agenda.routes').then(m => m.agendaRoutes) }

]

export const NO_DECORATED_ROUTES: Routes = [

  { path: "erro-processamento", component: ErroProcessamentoComponent },

  { path: "acesso-negado", component: AcessoNegadoComponent }

]
