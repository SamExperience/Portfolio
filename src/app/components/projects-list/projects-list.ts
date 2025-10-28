import { Component, Input } from '@angular/core';
import { Project } from '../../models/project';
import { Observable } from 'rxjs';
import { ProjectCardComponent } from '../project-card/project-card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ProjectCardComponent, CommonModule],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
})
export class ProjectsList {
  @Input() projects$: Observable<Project[]> | undefined;
}
