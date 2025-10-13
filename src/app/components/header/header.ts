import { Component } from '@angular/core';
import { MenuIconComponent } from '../menu-icon/menu-icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuIconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
