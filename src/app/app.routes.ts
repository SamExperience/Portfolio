import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/portfolio/portfolio').then((m) => m.Portfolio),
    title: 'Samuele Deriu - Portfolio',
  },
  {
    path: 'project/:id',
    loadComponent: () =>
      import('./components/project-detail/project-detail').then((m) => m.ProjectDetail),
    title: 'Samuele Deriu - Project Details',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
