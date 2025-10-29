import { Component, Input, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-selector.html',
  styleUrls: ['./language-selector.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  @Input() languages: string[] = ['en', 'it', 'fr'];
  langOpen = false;
  currentLang = 'en';

  svgMap: Record<string, string> = {
    en: `<svg>...</svg>`,
    it: `<svg>...</svg>`,
    fr: `<svg>...</svg>`,
  };

  constructor(private translate: TranslateService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('lang');
    const browser = (this.translate.getBrowserLang() || '').split('-')[0];
    const defaultLang = this.translate.getDefaultLang() || 'en';

    this.currentLang = saved ?? (this.languages.includes(browser) ? browser : defaultLang);

    this.translate.use(this.currentLang).subscribe(() => {
      this.cd.detectChanges(); // forza il rilevamento cambiamenti
    });
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.langOpen = !this.langOpen;
  }

  changeLanguage(lang: string, event: Event) {
    event.stopPropagation();
    if (lang === this.currentLang) {
      this.langOpen = false;
      return;
    }

    this.translate.use(lang).subscribe(() => {
      this.currentLang = lang;
      localStorage.setItem('lang', lang);
      this.langOpen = false;
      this.cd.detectChanges(); // forza aggiornamento template
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const el = event.target as HTMLElement;
    if (!el.closest('.lang-dropdown')) {
      this.langOpen = false;
      this.cd.detectChanges();
    }
  }
}
