import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // storageKey values: 'dark' | 'light'
  private storageKey = 'theme';
  // attribute used on the root element: <html data-theme="dark">
  private attrName = 'data-theme';

  constructor() {
    // Apply saved theme at service construction (early)
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === 'dark') {
        this.enableDark();
      } else if (saved === 'light') {
        this.enableLight();
      } else {
        // Optional: follow system preference if no saved value
        const prefersDark =
          typeof window !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) this.enableDark();
        else this.enableLight();
      }
    } catch (e) {
      // If localStorage is not available or throws, fall back to system preference
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
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
    try {
      localStorage.setItem(this.storageKey, 'dark');
    } catch (e) {
      // ignore localStorage errors
    }
  }

  enableLight(): void {
    document.documentElement.removeAttribute(this.attrName); // uses :root for light defaults
    try {
      localStorage.setItem(this.storageKey, 'light');
    } catch (e) {
      // ignore localStorage errors
    }
  }
}
