import { Routes } from '@angular/router';
import { Portfolio } from './components/portfolio/portfolio';

export const routes: Routes = [
  { path: '', component: Portfolio, title: 'Samuele Deriu - Portfolio' },
  { path: '**', redirectTo: '' },
];
