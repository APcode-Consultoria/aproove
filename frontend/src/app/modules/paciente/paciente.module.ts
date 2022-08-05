import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxMaskModule} from 'ngx-mask';

import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../core/core.module';

import {CadastroComponent} from './cadastro/cadastro.component';
import {PacienteRoutingModule} from './paciente-routing.module';
import {PesquisarComponent} from './pesquisar/pesquisar.component';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
  declarations: [
    CadastroComponent,
    PesquisarComponent
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    CoreModule,
    DataTablesModule
  ],
  providers: [
    DatePipe
  ]
})
export class PacienteModule { }
