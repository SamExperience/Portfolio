import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule, // rende disponibili pipe/directive di ngx-translate nei template
  ],
  templateUrl: './app.html',
})
export class App {
  constructor(private translate: TranslateService) {
    // lingue disponibili
    this.translate.addLangs(['en', 'it', 'fr']);

    // fallback
    this.translate.setDefaultLang('en');

    // priorità: localStorage -> browserLang -> fallback 'en'
    const saved = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();
    const pick =
      saved ?? (browserLang && ['en', 'it', 'fr'].includes(browserLang) ? browserLang : 'en');

    this.translate.use(pick);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
