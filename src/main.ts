// main.ts (bootstrap)
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

// ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// custom TranslateLoader
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return {
    getTranslation: (lang: string) => http.get<Record<string, any>>(`./assets/i18n/${lang}.json`),
  } as TranslateLoader;
}

// abilitare modalità production solo in build prod
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
      })
    ),
  ],
}).catch((err) => console.error(err));
