import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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

  //timer for skeleton template
  timerSkeleton = true;
  private tmpTemplate: ReturnType<typeof setTimeout> | null = null;

  // UI flags
  loading = true;
  notFound = false;
  serverError = false;

  // IntersectionObserver instance (single, reusable)
  private observer: IntersectionObserver | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private hostRef: ElementRef<HTMLElement>,
    private theme: ThemeService
  ) {}

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

  private observeElements(): void {
    this.createObserverIfNeeded();

    setTimeout(() => {
      if (!this.observer) return;

      const root = this.hostRef.nativeElement;
      const elements = root.querySelectorAll<HTMLElement>('.animate-on-scroll');

      elements.forEach((el) => {
        this.observer!.observe(el);
      });
    }, 0);
  }

  ngOnInit(): void {
    //timer for skeleton
    this.tmpTemplate = setTimeout(() => {
      this.timerSkeleton = false;
      this.tmpTemplate = null;
    }, 0);

    // React to route changes and load the project
    this.project$ = this.route.paramMap.pipe(
      tap(() => {
        // reset UI flags for a new load
        this.loading = true;
        this.notFound = false;
        this.serverError = false;
      }),
      switchMap((params) => {
        const idParam = params.get('id');
        const id = idParam ? Number(idParam) : NaN;

        if (!idParam || Number.isNaN(id)) {
          // invalid id — show not found and return an empty observable
          this.notFound = true;
          this.loading = false;
          return of(null); // garantisce Observable<Project | null>
        }

        // call the service
        return this.dataService.getProjectByID(id).pipe(
          catchError((err) => {
            // treat any error as server error / not found fallback
            this.loading = false;
            this.serverError = true;
            console.error('Failed to load project', err);
            return of(null); // garantisce Observable<Project | null>
          }),
          tap((proj) => {
            this.loading = false;

            // observe elements if project found
            if (proj) {
              this.observeElements();
            } else {
              this.notFound = true;
            }
          }),
          // normalize undefined to null so the observable type becomes Project | null
          map((proj) => proj ?? null)
        );
      })
    );
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.tmpTemplate) {
      clearTimeout(this.tmpTemplate);
      this.tmpTemplate = null;
    }
  }

  /* function for ngfor  */
  trackByFn(index: number, item: any): string | number {
    return item?.id ?? item?.url ?? index;
  }

  //function for img hero in html
  hasHero(project: Project | null): boolean {
    return !!project && (!!project.heroImage || (project.imgURL?.length ?? 0) > 0);
  }
}
