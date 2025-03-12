import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { ReactiveFormsModule } from "@angular/forms";
import { NgxLoadingModule } from "ngx-loading";
import { CadastroComponent } from './cadastro/cadastro.component';
import { PacienteRoutingModule } from './paciente-routing.module';
import { PesquisarComponent } from './pesquisar/pesquisar.component';
import { FloatingButtonComponent } from "@andre.penteado/ngx-apcore";

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
    NgxLoadingModule,
    ReactiveFormsModule,
    FloatingButtonComponent
  ],
  providers: [
    provideNgxMask(),
    DatePipe
  ]
})
export class PacienteModule { }
