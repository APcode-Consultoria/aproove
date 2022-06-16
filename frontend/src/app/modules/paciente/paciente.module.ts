import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CadastroComponent } from './cadastro/cadastro.component';
import { PacienteRoutingModule } from './paciente-routing.module';
import { PesquisarComponent } from './pesquisar/pesquisar.component';

@NgModule({
  declarations: [
    CadastroComponent,
    PesquisarComponent
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    SharedModule
  ],
  providers: [
    DatePipe
  ]
})
export class PacienteModule { }
