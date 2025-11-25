import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-menu-mobile',
  imports: [CommonModule, TranslateModule],
  templateUrl: './nav-menu-mobile.html',
  styleUrl: './nav-menu-mobile.scss',
})
export class NavMenuMobile implements OnInit {
  activeLink: string = '#hero-section';

  ngOnInit(): void {
    // Set active link based on current hash
    this.activeLink = window.location.hash || '#hero-section';

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.activeLink = window.location.hash;
    });
  }

  setActiveLink(href: string): void {
    this.activeLink = href;
  }

  isActive(href: string): boolean {
    return this.activeLink === href;
  }
}
