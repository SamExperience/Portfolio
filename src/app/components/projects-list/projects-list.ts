import { Component, Input } from '@angular/core';
import { Project } from '../../models/project';
import { Observable } from 'rxjs';
import { ProjectCardComponent } from '../project-card/project-card';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ProjectCardComponent, CommonModule, TranslateModule],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
})
export class ProjectsList {
  @Input() projects$: Observable<Project[]> | undefined;
}
