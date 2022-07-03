import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { FloatingButtonComponent } from './components/floating-button.component';
import { HomeComponent } from './components/home.component';


@NgModule({
  declarations: [
    FloatingButtonComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  exports: [
    FloatingButtonComponent
  ]
})
export class CoreModule { }
