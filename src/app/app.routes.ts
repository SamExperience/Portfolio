import { Routes } from '@angular/router';
import { Portfolio } from './components/portfolio/portfolio';
import { ProjectDetail } from './components/project-detail/project-detail';

export const routes: Routes = [
  { path: '', component: Portfolio, title: 'Samuele Deriu - Portfolio' },
  { path: 'project:/id', component: ProjectDetail, title: 'Samuele Deriu - Portfolio' },
  { path: '**', redirectTo: '' },
];
