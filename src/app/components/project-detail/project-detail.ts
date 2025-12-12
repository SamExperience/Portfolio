import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Project } from '../../models/project';
import { DataService } from '../../services/data-service';
import { Footer } from '../footer/footer';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [Footer, CommonModule, TranslateModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss'],
})
export class ProjectDetail implements OnInit, OnDestroy {
  /** Observable stream of the current project data */
  project$!: Observable<Project | null>;

  /** Controls skeleton loader visibility */
  showSkeleton = true;

  /** Indicates if the requested project was not found (404) */
  notFound = false;

  /** Indicates if a server error occurred during data fetching */
  serverError = false;

  /** Timer reference for skeleton hide delay */
  private skeletonTimer: ReturnType<typeof setTimeout> | null = null;

  /** IntersectionObserver instance for scroll animations */
  private observer: IntersectionObserver | null = null;

  /** Subject to handle component cleanup and unsubscribe from observables */
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private hostRef: ElementRef<HTMLElement>,
    private theme: ThemeService
  ) {}

  /**
   * Initializes IntersectionObserver if not already created.
   * Adds 'is-visible' class to elements when they enter the viewport.
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
      {
        threshold: 0,
        rootMargin: '50px',
      }
    );
  }

  /**
   * Observes all elements with '.animate-on-scroll' class for scroll animations.
   * Retries if elements are not yet rendered in the DOM.
   */
  private observeElements(): void {
    this.createObserverIfNeeded();

    setTimeout(() => {
      if (!this.observer) return;
      const root = this.hostRef.nativeElement;
      const elements = root.querySelectorAll<HTMLElement>('.animate-on-scroll');

      console.log('🔍 Found elements:', elements.length);

      if (elements.length === 0) {
        console.warn('⚠️ No .animate-on-scroll elements found! Retrying...');
        setTimeout(() => this.observeElements(), 200);
        return;
      }

      elements.forEach((el) => {
        this.observer!.observe(el);
      });
    }, 100);
  }

  /** Clears the skeleton timer if it exists */
  private clearSkeletonTimer(): void {
    if (this.skeletonTimer) {
      clearTimeout(this.skeletonTimer);
      this.skeletonTimer = null;
    }
  }

  /**
   * Hides the skeleton loader after a specified delay.
   * @param delayMs Delay in milliseconds before hiding (default: 1000ms)
   */
  private hideSkeletonWithDelay(delayMs: number = 1000): void {
    this.clearSkeletonTimer();
    this.skeletonTimer = setTimeout(() => {
      this.showSkeleton = false;
      this.skeletonTimer = null;
    }, delayMs);
  }

  /**
   * Initializes the component and sets up the reactive data pipeline.
   * Handles route parameter changes, data loading, error states, and UI updates.
   */
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.project$ = this.route.paramMap.pipe(
      tap(() => {
        this.showSkeleton = true;
        this.notFound = false;
        this.serverError = false;
        this.clearSkeletonTimer();
      }),
      switchMap((params): Observable<Project | null> => {
        const idParam = params.get('id');
        const id = idParam ? Number(idParam) : NaN;

        if (!idParam || Number.isNaN(id)) {
          this.notFound = true;
          this.showSkeleton = false;
          return of(null);
        }

        return this.dataService.getProjectByID(id).pipe(
          map((project): Project | null => project ?? null),
          catchError((err): Observable<Project | null> => {
            console.error('Failed to load project', err);
            this.serverError = true;
            this.showSkeleton = false;
            return of(null);
          }),
          tap((project) => {
            if (project) {
              this.observeElements();
              this.hideSkeletonWithDelay(1000);
            } else {
              this.notFound = true;
              this.showSkeleton = false;
            }
          })
        );
      }),
      shareReplay(1)
    );

    this.project$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  /**
   * Cleanup lifecycle hook.
   * Disconnects observer, clears timers, and completes observables.
   */
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.clearSkeletonTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * TrackBy function for ngFor optimization.
   * @returns Unique identifier for each item
   */
  trackByFn(index: number, item: any): string | number {
    return item?.id ?? item?.url ?? index;
  }

  /**
   * Checks if the project has a hero image to display.
   * @param project The project to check
   * @returns True if hero image exists
   */
  hasHero(project: Project | null): boolean {
    return !!project && (!!project.heroImage || (project.imgURL?.length ?? 0) > 0);
  }
}
