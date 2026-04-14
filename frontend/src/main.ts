import { importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { INIT_CONFIG, InitConfig } from "./app/config/init-config.token";
import { AppComponent } from "./app/app.component";
import { LOGOTIPO, MODULO, PREFIXO_PERFIL_SISTEMA } from "./app/config/layout";
import { menu } from "./app/config/menu";
import { HttpErrorsInterceptor, PARAMS, WithCredentialsInterceptor } from '@andre.penteado/ngx-apcore';
import localePT from '@angular/common/locales/pt';
import { provideNgxMask } from "ngx-mask";
import { appRoutes } from "./app/app.routes";

registerLocaleData(localePT);

const CONFIG = (window as any).initConfig as InitConfig;

bootstrapApplication(
  AppComponent, {
    providers: [
      provideZoneChangeDetection({eventCoalescing: true}),
      provideRouter(appRoutes),
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
      provideNgxMask(),
      importProvidersFrom(
        ToastrModule.forRoot()
      ),
      {
        provide: LOCALE_ID,
        useValue: 'pt-BR'
      },
      {
        provide: INIT_CONFIG,
        useValue: CONFIG
      },
      {
        provide: PARAMS,
        useValue: {
          logotipo: LOGOTIPO,
          menu: menu,
          sistema: MODULO,
          urlBackend: CONFIG.urlBackend,
          prefixoPerfil: PREFIXO_PERFIL_SISTEMA
        }
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorsInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: WithCredentialsInterceptor,
        multi: true
      }
    ]
  }
);
