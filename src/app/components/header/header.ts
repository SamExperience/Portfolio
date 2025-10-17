import { Component } from '@angular/core';
import { MenuIconComponent } from '../menu-icon/menu-icon';
import { CommonModule } from '@angular/common';
import { MenuMobile } from '../menu-mobile/menu-mobile';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuIconComponent, MenuMobile],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
