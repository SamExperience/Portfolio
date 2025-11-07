import {
  Component,
  Input,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * LanguageSelectorComponent
 * -------------------------
 * This component provides a dropdown menu to switch app languages using ngx-translate.
 * It displays the current flag, saves the user's choice in localStorage,
 * and updates translations immediately across the app.
 *
 * Features:
 * - Detects saved or browser language on init
 * - Updates translation instantly
 * - Persists user preference
 * - Closes dropdown on outside click
 * - Accessible with ARIA and live region updates
 */

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

  langLabels: Record<string, string> = {
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
  };

  @ViewChild('liveRegion', { static: true }) liveRegion!: ElementRef | undefined;

  constructor(private translate: TranslateService, private cd: ChangeDetectorRef) {}

  // Initialize language based on saved preference, browser setting, or default
  ngOnInit(): void {
    const saved = localStorage.getItem('lang');
    const browser = (this.translate.getBrowserLang() || '').split('-')[0];
    const defaultLang = this.translate.getDefaultLang() || 'en';

    this.currentLang =
      saved && this.languages.includes(saved)
        ? saved
        : this.languages.includes(browser)
        ? browser
        : defaultLang;

    this.translate.use(this.currentLang).subscribe(() => {
      this.cd.detectChanges();
    });
  }

  // Returns the display label for a given language code
  getLangLabel(code: string) {
    return this.langLabels[code] ?? code;
  }

  // Opens or closes the language dropdown
  toggle(event: Event) {
    event.stopPropagation();
    this.langOpen = !this.langOpen;
  }

  // Changes the app language and saves it to localStorage
  changeLanguage(lang: string, event: Event) {
    event.stopPropagation();
    if (lang === this.currentLang) {
      this.langOpen = false;
      return;
    }

    this.translate.use(lang).subscribe(() => {
      this.currentLang = lang;
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;

      // Announce language change for screen readers
      if (this.liveRegion?.nativeElement) {
        this.liveRegion.nativeElement.textContent = `Language set to ${this.getLangLabel(lang)}`;
      }

      this.langOpen = false;
      this.cd.detectChanges();
    });
  }

  // Closes dropdown when clicking outside the component
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const el = event.target as HTMLElement;
    if (!el.closest('.lang-dropdown')) {
      this.langOpen = false;
      this.cd.detectChanges();
    }
  }
}
