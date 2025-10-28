import { Component, AfterViewInit, HostListener, OnInit, Output } from '@angular/core';
import { Hero } from '../hero/hero';
import { ProjectsList } from '../projects-list/projects-list';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Project } from '../../models/project';
import { DataService } from '../../services/data-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [Hero, ProjectsList, About, Contact, CommonModule],
  templateUrl: './content.html',
  styleUrls: ['./content.scss'],
})
export class Content implements AfterViewInit, OnInit {
  showArrows = false;
  projects$: Observable<Project[]> | null = null;

  constructor(private data: DataService) {
    this.projects$ = data.getProjects();
  }

  ngOnInit(): void {
    this.projects$ = this.data.getProjects();
  }

  ngAfterViewInit(): void {
    this.checkScroll();
  }

  // 👇 Listener per lo scroll della finestra
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    this.showArrows = y > 100; // mostra le frecce dopo 100px
  }
}
