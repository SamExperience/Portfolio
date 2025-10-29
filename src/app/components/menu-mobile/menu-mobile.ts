import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-menu-mobile',
  imports: [TranslateModule, CommonModule],
  templateUrl: './menu-mobile.html',
  styleUrl: './menu-mobile.scss',
})
export class MenuMobile {
  @Input() open = false;
  @Output() closeRequest = new EventEmitter<void>();

  onCloseClick(): void {
    this.closeRequest.emit();
  }

  // Optional: close when clicking an internal link
  onLinkClick(): void {
    this.closeRequest.emit();
  }
}
