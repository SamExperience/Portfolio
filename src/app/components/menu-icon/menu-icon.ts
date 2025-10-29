// src/app/components/menu-icon/menu-icon.ts
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-menu-icon',
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu-icon.html',
  styleUrls: ['./menu-icon.scss'],
})
export class MenuIconComponent {
  private host: HTMLElement;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.host = this.el.nativeElement;
  }

  /** Play a short visual animation on the icon */
  play(): void {
    this.renderer.addClass(this.host, 'playing');
    // remove the class after animation duration to allow replay
    window.setTimeout(() => this.renderer.removeClass(this.host, 'playing'), 420);
  }

  /** Stop any ongoing visual state (immediate) */
  stop(): void {
    this.renderer.removeClass(this.host, 'playing');
  }
}
