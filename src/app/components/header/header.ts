import { Component } from '@angular/core';
import { MenuIconComponent } from '../menu-icon/menu-icon';
import { CommonModule } from '@angular/common';
import { MenuMobile } from '../menu-mobile/menu-mobile';
import { ThemeService } from '../../services/theme-service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../language-selector/language-selector';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenuIconComponent,
    MenuMobile,
    TranslateModule,
    LanguageSelectorComponent,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false;

  constructor(public themeService: ThemeService) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    // optional: lock body scroll when open
    document.body.classList.toggle('menu-open', this.isMenuOpen);
  }

  handleCloseMenu(): void {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-open');
  }

  onToggle() {
    this.themeService.toggle();
  }
}
