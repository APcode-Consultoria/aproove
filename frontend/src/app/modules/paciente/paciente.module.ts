import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PacienteRoutingModule } from './paciente-routing.module';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PesquisarComponent } from './pesquisar/pesquisar.component';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FloatingButtonComponent } from "@andre.penteado/ngx-apcore";
import { NgxSpinnerModule } from 'ngx-spinner';

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
    ReactiveFormsModule,
    FloatingButtonComponent,
    NgxSpinnerModule
  ],
  providers: [
    provideNgxMask(),
    DatePipe
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PacienteModule { }
