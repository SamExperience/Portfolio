import { Routes } from '@angular/router';
import { Portfolio } from './components/portfolio/portfolio';

export const routes: Routes = [
  { path: '', component: Portfolio },
  { path: '**', redirectTo: '' },
];
