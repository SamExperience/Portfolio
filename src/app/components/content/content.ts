import { Component, AfterViewInit, HostListener } from '@angular/core';
import { Hero } from '../hero/hero';
import { ProjectsList } from '../projects-list/projects-list';
import { About } from '../about/about';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [Hero, ProjectsList, About, Contact],
  templateUrl: './content.html',
  styleUrls: ['./content.scss'],
})
export class Content implements AfterViewInit {
  showArrows = false;

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
