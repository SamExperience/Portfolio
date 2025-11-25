import { Component, HostListener, OnInit } from '@angular/core';
import { Hero } from '../hero/hero';
import { ProjectsList } from '../projects-list/projects-list';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Project } from '../../models/project';
import { DataService } from '../../services/data-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NavMenuMobile } from '../nav-menu-mobile/nav-menu-mobile';
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [Hero, ProjectsList, About, Contact, CommonModule, TranslateModule, NavMenuMobile],
  templateUrl: './content.html',
  styleUrls: ['./content.scss'],
})
export class Content implements OnInit {
  // Determines if scroll arrows are visible
  showArrows = false;

  // Observable of projects, automatically updated when language changes
  projects$: Observable<Project[]> | null = null;

  constructor(private data: DataService) {}

  ngOnInit(): void {
    // Initialize the projects$ observable from the DataService
    // It automatically updates when the language changes
    this.projects$ = this.data.getProjects();

    // Initialize scroll state
    this.checkScroll();
  }

  /**
   * Listen for window scroll events
   * and update the showArrows flag accordingly.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  /**
   * Check current scroll position and update showArrows flag.
   * Avoids unnecessary updates if the state hasn't changed.
   */
  private checkScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const shouldShow = y > 100;

    if (this.showArrows !== shouldShow) {
      this.showArrows = shouldShow;
    }
  }
}
