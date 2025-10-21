import { Routes } from '@angular/router';
import { Portfolio } from './components/portfolio/portfolio';
import { Project } from './components/project/project';
export const routes: Routes = [
  { path: 'portfolio-samuele-deriu', component: Portfolio },
  { path: 'project', component: Project },
];
