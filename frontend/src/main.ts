import { ErrorHandler, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { INIT_CONFIG, InitConfig } from "./app/config/init-config.token";
import { AppComponent } from "./app/app.component";
import { DESCRICAO, LOGOTIPO, MODULO, PREFIXO_PERFIL_SISTEMA } from "./app/config/layout";
import { menu } from "./app/config/menu";
import { apcoreInterceptors, FaroErrorHandler, initFaro, PARAMS } from '@andre.penteado/ngx-apcore';
import localePT from '@angular/common/locales/pt';
import { provideNgxMask } from "ngx-mask";
import { appRoutes } from "./app/app.routes";
import { environment } from './environments/environment';
import packageJson from '../package.json';

// Antes do bootstrap, para capturar erros e métricas do próprio carregamento
initFaro({
  appName: 'roove-frontend',
  appVersion: packageJson.version,
  enabled: environment.production
});

registerLocaleData(localePT);

const CONFIG = (window as any).initConfig as InitConfig;

bootstrapApplication(
  AppComponent, {
    providers: [
      { provide: ErrorHandler, useClass: FaroErrorHandler },
      provideZoneChangeDetection({eventCoalescing: true}),
      provideRouter(appRoutes),
      provideAnimations(),
      provideHttpClient(withXhr(), withInterceptorsFromDi(), withInterceptors(apcoreInterceptors)),
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
          descricao: DESCRICAO,
          urlBackend: CONFIG.urlBackend,
          urlPortal: CONFIG.urlPortal,
          prefixoPerfil: PREFIXO_PERFIL_SISTEMA
        }
      },
    ]
  }
);
