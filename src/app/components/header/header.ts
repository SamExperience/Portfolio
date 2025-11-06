import { Component } from '@angular/core';
import { MenuIconComponent } from '../menu-icon/menu-icon';
import { CommonModule } from '@angular/common';
import { MenuMobile } from '../menu-mobile/menu-mobile';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../language-selector/language-selector';
import { ToggleTheme } from '../toggle-theme/toggle-theme';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenuIconComponent,
    MenuMobile,
    TranslateModule,
    LanguageSelectorComponent,
    ToggleTheme,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    // optional: lock body scroll when open
    document.body.classList.toggle('menu-open', this.isMenuOpen);
  }

  handleCloseMenu(): void {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-open');
  }
}
