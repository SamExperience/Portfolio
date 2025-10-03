import { Component } from '@angular/core';
import { ProjectCard } from '../project-card/project-card';
@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ProjectCard],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
})
export class ProjectsList {}
