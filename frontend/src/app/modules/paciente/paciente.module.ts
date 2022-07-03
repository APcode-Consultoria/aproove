import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { AppModule } from 'src/app/app.module';

import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../core/core.module';

import { CadastroComponent } from './cadastro/cadastro.component';
import { PacienteRoutingModule } from './paciente-routing.module';
import { PesquisarComponent } from './pesquisar/pesquisar.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

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
    NgxDatatableModule,
    CoreModule
  ],
  providers: [
    DatePipe
  ]
})
export class PacienteModule { }
