// main.ts (solo la parte loader / bootstrap)
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';

// ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// custom TranslateLoader semplice e compatibile
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return {
    getTranslation: (lang: string) => http.get<Record<string, any>>(`./assets/i18n/${lang}.json`),
  } as TranslateLoader;
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
