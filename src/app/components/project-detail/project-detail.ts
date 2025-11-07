import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ToggleTheme } from '../toggle-theme/toggle-theme';
import { Project } from '../../models/project';
import { DataService } from '../../services/data-service';
import { Footer } from '../footer/footer';
import { ThemeService } from '../../services/theme-service';
/**
 * Simple summary:
 * - Loads a project based on the route `id` and exposes it as `project$` for the template (use async pipe).
 * - Manages UI flags: `loading`, `notFound`, and `serverError` so the template can show proper states.
 * - When the project data is available, sets up an IntersectionObserver that finds elements with
 *   the `.animate-on-scroll` class (inside this component only) and adds `.is-visible` to trigger CSS animations.
 * - Uses a single, reusable observer instance and disconnects it in ngOnDestroy to avoid memory leaks.
 *
 * Key benefits:
 * - Keeps data loading reactive (no manual subscribe).
 * - Limits DOM queries to this component (safer than querying the whole document).
 * - Encapsulates scroll-triggered animation setup and cleanup in a predictable way.
 */

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [Footer, CommonModule, TranslateModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss'],
})
export class ProjectDetail implements OnInit, OnDestroy {
  // Observable exposed to the template; use async pipe there.
  project$!: Observable<Project | null>;

  // UI flags
  loading = true;
  notFound = false;
  serverError = false;

  // IntersectionObserver instance (single, reusable)
  private observer: IntersectionObserver | null = null;

  /**
   * Constructor
   * - Injects DataService for fetching project data.
   * - Injects ActivatedRoute to read route parameters.
   * - Injects Router for optional programmatic navigation.
   *
   * Note: Constructor should not contain logic — it only sets up injected deps.
   *
   * We also inject ElementRef to query elements ONLY inside this component's DOM
   * (safer than document.querySelectorAll).
   */
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private hostRef: ElementRef<HTMLElement>,
    private theme: ThemeService
  ) {}

  /**
   * Create the observer once (idempotent)
   */
  private createObserverIfNeeded(): void {
    if (this.observer) return;

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], observerRef) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible');
            observerRef.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }

  /**
   * Observe elements after the template DOM has been updated.
   * Using hostRef.nativeElement.querySelectorAll limits the search to this component's DOM.
   * We use setTimeout(..., 0) to schedule the call after Angular has applied the template
   * (useful when the HTML is rendered by the async pipe).
   */
  private observeElements(): void {
    this.createObserverIfNeeded();

    setTimeout(() => {
      if (!this.observer) return;

      // search only inside the component (not the whole document)
      const root = this.hostRef.nativeElement;
      const elements = root.querySelectorAll<HTMLElement>('.animate-on-scroll');

      // DEBUG: show how many elements were found
      console.log('[ProjectDetail] observeElements found', elements.length, 'elements inside host');

      elements.forEach((el) => {
        this.observer!.observe(el);
      });
    }, 0);
  }

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
          catchError((err) => {
            // differentiate errors if your service exposes status (e.g. 404)
            // for now treat any error as server error / not found fallback
            this.loading = false;
            this.serverError = true;
            console.error('Failed to load project', err);
            return of(null);
          }),
          tap((proj) => {
            this.loading = false;
            // debug log to understand the flow
            console.log('[ProjectDetail] project loaded in tap:', proj);
            if (proj) {
              // Observe elements ONLY when the project exists.
              this.observeElements();
            } else {
              this.notFound = true;
            }
          }),
          map((proj) => {
            // if backend uses `null` for not found, propagate null
            if (!proj) {
              this.notFound = true;
              return null;
            }
            return proj;
          })
        );
      })
    );
  }

  /**
   * ngOnDestroy
   * - Clean up IntersectionObserver to avoid memory leaks
   */
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  /* function for ngfor  */
  trackByFn(index: number, item: any): number {
    return item.id; // o qualsiasi identificatore unico
  }
}
