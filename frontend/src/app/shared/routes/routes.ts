import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';


export const content: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'paciente',
    loadChildren: () => import('../../modules/paciente/paciente.module').then(m => m.PacienteModule)
  }
];
