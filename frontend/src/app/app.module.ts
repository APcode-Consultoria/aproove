import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from "../environments/environment";
import { LOGOTIPO, MODULO, PREFIXO_PERFIL_SISTEMA } from "./config/layout";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { MENU } from "./config/menu";
import { registerLocaleData } from "@angular/common";
import localePT from '@angular/common/locales/pt';
import { HttpErrorsInterceptor, PARAMS, WithCredentialsInterceptor } from "@andre.penteado/ngx-apcore";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

registerLocaleData(localePT);

@NgModule({
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot()],
    providers: [
    {
      provide: LOCALE_ID, useValue: "pt-BR"
    },
    {
      provide: PARAMS, useValue: {
        logotipo: LOGOTIPO,
        menu: MENU,
        sistema: MODULO,
        urlBackend: environment.urlBackend,
        urlFrontend: environment.urlFrontend,
        prefixoPerfil: PREFIXO_PERFIL_SISTEMA
      }
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: WithCredentialsInterceptor, multi: true
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
}
