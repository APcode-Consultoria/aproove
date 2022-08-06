import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { FloatingButtonComponent } from './components/floating-button.component';
import { HomeComponent } from './components/home.component';
import { ExibeMensagemComponent } from './components/exibe-mensagem.component';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    FloatingButtonComponent,
    HomeComponent,
    ExibeMensagemComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    NgbToastModule
  ],
  exports: [
    FloatingButtonComponent,
    ExibeMensagemComponent
  ]
})
export class CoreModule { }
