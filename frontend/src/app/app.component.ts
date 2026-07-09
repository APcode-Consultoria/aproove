import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ RouterOutlet ]
})
export class AppComponent {
}
