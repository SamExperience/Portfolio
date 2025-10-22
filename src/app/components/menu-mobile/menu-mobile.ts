import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
@Component({
  standalone: true,
  selector: 'app-menu-mobile',
  imports: [],
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
