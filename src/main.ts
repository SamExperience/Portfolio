import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes'; // le tue rotte

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule), // ✅ necessario per HttpClient
    importProvidersFrom(RouterModule.forRoot(routes)), // ✅ routing globale
  ],
}).catch((err) => console.error(err));
