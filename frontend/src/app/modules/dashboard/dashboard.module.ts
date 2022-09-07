import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CountToModule } from 'angular-count-to';

import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from '../core/core.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CoreModule,
    SharedModule,
    CountToModule
  ]
})
export class DashboardModule { }
