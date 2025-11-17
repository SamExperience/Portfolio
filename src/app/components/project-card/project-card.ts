import { Component, Input } from '@angular/core';
import { Project } from '../../models/project';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
})
export class ProjectCardComponent {
  @Input() public project?: Project;

  constructor(private router: Router) {}

  /**
   * Returns an absolute URL for a project detail page.
   * This works with target="_blank".
   */
  getProjectUrl(id?: number | string): string {
    if (!id) return '#';
    const tree = this.router.createUrlTree(['/project', id]);
    return window.location.origin + this.router.serializeUrl(tree);
  }

  navigateToProject(id?: number | string): void {
    if (!id) return;
    this.router.navigate(['/project', id]);
  }
}
