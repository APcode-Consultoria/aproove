import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { CadastroComponent } from './cadastro/cadastro.component';
import { PacienteRoutingModule } from './paciente-routing.module';
import { PesquisarComponent } from './pesquisar/pesquisar.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxApcoreModule } from "@andrepenteado/ngx-apcore";
import { NgxLoadingModule } from "ngx-loading";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    CadastroComponent,
    PesquisarComponent
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DataTablesModule,
    NgxApcoreModule,
    NgxLoadingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNgxMask(),
    DatePipe
  ]
})
export class PacienteModule { }
