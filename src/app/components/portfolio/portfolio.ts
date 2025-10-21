import { Component } from '@angular/core';
/* Components */
import { Header } from '../header/header';
import { Content } from '../content/content';
import { Footer } from '../footer/footer';
@Component({
  standalone: true,
  selector: 'app-portfolio',
  imports: [Content, Footer, Header],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {}
