import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from "../environments/environment";
import { clientId, clientSecret } from "./etc/oauth2";
import { LOGOTIPO, MODULO } from "./etc/layout";
import { HttpClientModule } from "@angular/common/http";
import { MENU } from "./etc/menu";
import { NgxApcoreModule } from "@andrepenteado/ngx-apcore";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxApcoreModule.forRoot({
      nomeSistema: MODULO,
      logotipoSistema: LOGOTIPO,
      urlBackendSistema: environment.backendURL,
      urlPortal: environment.portalURL,
      urlBackendPortal: environment.backendPortalURL,
      menu: MENU,
      clientId: clientId,
      redirectUri: environment.redirectUri,
      clientSecret: clientSecret,
      urlAuthorizationServer: environment.urlAuthorizationServer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
