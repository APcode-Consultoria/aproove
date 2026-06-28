import { Component } from "@angular/core";
import { AuthorizedComponent as ApcoreAuthorizedComponent } from "@andre.penteado/ngx-apcore";
import { NgxSpinnerModule } from "ngx-spinner";
import { RooveUserLogin } from "./roove-user-login";

@Component({
  selector: 'app-authorized',
  imports: [
    NgxSpinnerModule
  ],
  template: `
    <ngx-spinner
      color="rgba(var(--bs-secondary-bg-rgb), 0.8)"
      bdColor="rgba(var(--bs-secondary-color-rgb), 0.8)"
      type="ball-atom">
      <p style="font-size: 20px; color: rgba(var(--bs-secondary-bg-rgb), 0.8); margin-top: 160px;">
        Aguarde, carregando ...
      </p>
    </ngx-spinner>
  `,
  styles: ``,
  standalone: true
})
export class AuthorizedComponent extends ApcoreAuthorizedComponent<RooveUserLogin> {

  protected override afterLogin(userLogin: RooveUserLogin): void {
    this.loginService.setFoto(userLogin.fotoBase64);
  }

}
