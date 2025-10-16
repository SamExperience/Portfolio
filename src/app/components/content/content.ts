import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { ProjectsList } from '../projects-list/projects-list';
import { About } from '../about/about';
/* COMPONENTS */

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [Hero, ProjectsList, About],
  templateUrl: './content.html',
  styleUrl: './content.scss',
})
export class Content {}
