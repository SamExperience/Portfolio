import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Project } from '../../models/project';
import { DataService } from '../../services/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-project-detail',
  // uncomment `standalone: true` if you want a standalone component
  // standalone: true,
  imports: [Footer, CommonModule, TranslateModule],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss'],
})
export class ProjectDetail implements OnInit {
  // Observable exposed to the template; use async pipe there.
  project$!: Observable<Project | null>;

  // UI flags
  loading = true;
  notFound = false;
  serverError = false;

  /**
   * Constructor
   * - Injects DataService for fetching project data.
   * - Injects ActivatedRoute to read route parameters.
   * - Injects Router for optional programmatic navigation.
   *
   * Note: Constructor should not contain logic — it only sets up injected deps.
   */
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * ngOnInit
   * - Subscribes to route paramMap and reacts to `id` changes.
   * - Validates the `id` parameter and sets UI flags accordingly (loading, notFound).
   * - Switches to the HTTP call returned by dataService.getProjectByID(id).
   * - Maps and handles the response:
   *    - if project exists -> emit project
   *    - if project is null -> set notFound flag and emit null
   * - Handles errors by setting serverError and returning null so the template can react.
   *
   * The function exposes `project$` (Observable) so the template can use the async pipe,
   * avoiding manual subscription management in the component template.
   */
  ngOnInit(): void {
    // React to route changes and load the project
    this.project$ = this.route.paramMap.pipe(
      // when params change, extract the id and switch to the HTTP observable
      switchMap((params) => {
        const idParam = params.get('id');

        // Validate id exists and is a number (adjust if your IDs are strings/UUIDs)
        const id = idParam ? Number(idParam) : NaN;
        if (!idParam || Number.isNaN(id)) {
          // invalid id — show not found and return an empty observable
          this.notFound = true;
          this.loading = false;
          return of(null);
        }

        // start loading
        this.loading = true;
        this.notFound = false;
        this.serverError = false;

        // call the service
        return this.dataService.getProjectByID(id).pipe(
          tap(() => (this.loading = false)),
          map((proj) => {
            // if backend uses `null` for not found, propagate null
            if (!proj) {
              this.notFound = true;
              return null;
            }
            return proj;
          }),
          catchError((err) => {
            // differentiate errors if your service exposes status (e.g. 404)
            // for now treat any error as server error / not found fallback
            this.loading = false;
            this.serverError = true;
            console.error('Failed to load project', err);
            return of(null);
          })
        );
      })
    );
  }
}
