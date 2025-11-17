import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ɵEmptyOutletComponent } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Project } from '../../models/project';
import { DataService } from '../../services/data-service';
import { Footer } from '../footer/footer';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [Footer, CommonModule, TranslateModule, RouterLink, ɵEmptyOutletComponent],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss'],
})
export class ProjectDetail implements OnInit, OnDestroy {
  // Observable of the loaded project. Template uses async pipe.
  project$!: Observable<Project | null>;

  // skeleton visibility flag and timer ref
  timerSkeleton = true;
  private tmpTemplate: ReturnType<typeof setTimeout> | null = null;

  // UI flags
  loading = true;
  notFound = false;
  serverError = false;

  // IntersectionObserver instance (single, reusable)
  private observer: IntersectionObserver | null = null;

  // Subject to teardown any internal kickoff subscription
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private hostRef: ElementRef<HTMLElement>,
    private theme: ThemeService
  ) {}

  // Creates the IntersectionObserver (only once).
  // Adds '.is-visible' to observed elements when they intersect.
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

  // Observes elements with the .animate-on-scroll class inside this component.
  private observeElements(): void {
    this.createObserverIfNeeded();

    // small timeout to ensure DOM nodes are rendered
    setTimeout(() => {
      if (!this.observer) return;
      const root = this.hostRef.nativeElement;
      const elements = root.querySelectorAll<HTMLElement>('.animate-on-scroll');
      elements.forEach((el) => this.observer!.observe(el));
    }, 0);
  }

  ngOnInit(): void {
    // Build the reactive pipeline that loads the project based on the route id.
    // The pipeline:
    //  - resets UI flags on each route change
    //  - loads data via dataService.getProjectByID
    //  - handles errors with catchError
    //  - triggers observeElements() when project is present
    //  - finalizes by hiding the skeleton after a short delay
    this.project$ = this.route.paramMap.pipe(
      tap(() => {
        // reset UI flags for a fresh load
        this.loading = true;
        this.notFound = false;
        this.serverError = false;

        // ensure skeleton visible at start
        this.timerSkeleton = true;

        // clear any previous timer
        if (this.tmpTemplate) {
          clearTimeout(this.tmpTemplate);
          this.tmpTemplate = null;
        }
      }),
      switchMap((params) => {
        const idParam = params.get('id');
        const id = idParam ? Number(idParam) : NaN;

        if (!idParam || Number.isNaN(id)) {
          // invalid id — mark notFound and return null observable
          this.notFound = true;
          this.loading = false;
          return of(null);
        }

        return this.dataService.getProjectByID(id).pipe(
          catchError((err) => {
            // treat any error as serverError and return null
            this.loading = false;
            this.serverError = true;
            console.error('Failed to load project', err);
            return of(null);
          }),
          tap((proj) => {
            this.loading = false;
            if (proj) {
              // project loaded -> setup scroll animations
              this.observeElements();
            } else {
              // no project returned
              this.notFound = true;
            }
          }),
          map((proj) => proj ?? null)
        );
      }),
      // ensure single HTTP execution and cached result for multiple subscribers
      shareReplay(1),
      // finalize always runs when the inner observable completes (success/error)
      finalize(() => {
        // ensure any previous timer cleared
        if (this.tmpTemplate) {
          clearTimeout(this.tmpTemplate);
          this.tmpTemplate = null;
        }

        // small delay so skeleton transition is smooth (adjust ms if needed)
        this.tmpTemplate = setTimeout(() => {
          this.timerSkeleton = false;
          this.tmpTemplate = null;
        }, 300);
      })
    );

    // Kickoff subscription: ensures the observable pipeline runs even while the skeleton is shown.
    // The kickoff subscription is torn down in ngOnDestroy via takeUntil(this.destroy$).
    this.project$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        // side-effects handled within the pipeline (tap)
      },
      error: () => {
        // errors handled inside the pipeline
      },
    });
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

    // teardown kickoff subscription
    this.destroy$.next();
    this.destroy$.complete();
  }

  // trackBy used in ngFor loops
  trackByFn(index: number, item: any): string | number {
    return item?.id ?? item?.url ?? index;
  }

  // returns true if the project has a hero image
  hasHero(project: Project | null): boolean {
    return !!project && (!!project.heroImage || (project.imgURL?.length ?? 0) > 0);
  }
}
