import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'theme'; // 'dark' | 'light'
  private attrName = 'theme';

  constructor() {
    // Apply saved theme at service construction (early)
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'dark') {
      this.enableDark();
    } else if (saved === 'light') {
      this.enableLight();
    } else {
      // Optional: follow system preference if no saved value
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) this.enableDark();
      else this.enableLight();
    }
  }

  isDark(): boolean {
    return document.documentElement.getAttribute(this.attrName) === 'dark';
  }

  toggle(): void {
    if (this.isDark()) this.enableLight();
    else this.enableDark();
  }

  enableDark(): void {
    document.documentElement.setAttribute(this.attrName, 'dark');
    localStorage.setItem(this.storageKey, 'dark');
  }

  enableLight(): void {
    document.documentElement.removeAttribute(this.attrName); // uses :root for light defaults
    // or: document.documentElement.setAttribute(this.attrName, 'light');
    localStorage.setItem(this.storageKey, 'light');
  }
}
