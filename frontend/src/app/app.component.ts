import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: 'app-root',
  template: `
    <ngx-spinner
      color="rgba(var(--bs-secondary-bg-rgb), 0.8)"
      bdColor="rgba(var(--bs-secondary-color-rgb), 0.8)"
      type="ball-atom">
      <p style="font-size: 20px; color: rgba(var(--bs-secondary-bg-rgb), 0.8); margin-top: 160px;">
        Aguarde, carregando ...
      </p>
    </ngx-spinner>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [ RouterOutlet, NgxSpinnerModule ]
})
export class AppComponent {
}
