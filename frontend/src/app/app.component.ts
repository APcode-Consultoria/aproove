import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: 'app-root',
  template: `
    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="large"
      color="#87ceeb"
      type="timer"
      [fullScreen]="true">
      <p style="color: #87ceeb">
        Aguarde, carregando...
      </p>
    </ngx-spinner>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ RouterOutlet, NgxSpinnerModule ]
})
export class AppComponent {
}
