import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
/* Components */
import { Content } from './components/content/content';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Content, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('portfolio');
}
