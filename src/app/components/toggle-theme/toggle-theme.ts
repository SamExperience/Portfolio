import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-toggle-theme',
  imports: [TranslateModule],
  templateUrl: './toggle-theme.html',
  styleUrl: './toggle-theme.scss',
})
export class ToggleTheme {
  constructor(public themeService: ThemeService) {}

  onToggle() {
    this.themeService.toggle();
  }
}
