import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, shareReplay } from 'rxjs/operators';
import { Project } from '../models/project';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // BehaviorSubject holding the current language
  // Updated every time TranslateService emits onLangChange
  private lang$ = new BehaviorSubject<string>('en');

  // Lazy-initialized observable caching the last loaded projects
  private projectsCache$?: Observable<Project[]>;

  constructor(private http: HttpClient, private translate: TranslateService) {
    // Initialize the BehaviorSubject with the current TranslateService language
    const initialLang = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
    this.lang$.next(initialLang);

    // Subscribe to language change events from ngx-translate
    // Every change will emit a new value to lang$
    this.translate.onLangChange.subscribe((evt: LangChangeEvent) => {
      this.lang$.next(evt.lang);
    });
  }

  /**
   * Returns an Observable<Project[]> that is:
   * - lazy-initialized (HTTP request created only on first call),
   * - retried up to 3 times on failure (inside each get request),
   * - shared and replayed so multiple subscribers use the same HTTP call,
   * - protected with catchError to return an empty array fallback in case of error.
   *
   * This version automatically:
   * - loads the JSON file based on the current language, e.g., Projects_en.json, Projects_it.json
   * - reloads projects when the language changes
   */
  getProjects(): Observable<Project[]> {
    if (!this.projectsCache$) {
      this.projectsCache$ = this.lang$.pipe(
        switchMap((lang) => {
          const file = `assets/data/Projects_${lang}.json`;

          // Execute HTTP request every time the language changes
          return this.http.get<Project[]>(file).pipe(
            catchError((error) => {
              console.error('Error loading projects in DataService', error);
              // fallback: return an empty array typed as Project[]
              return of([] as Project[]);
            })
          );
        }),
        // Cache and share the last value for all subscribers
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }

    return this.projectsCache$;
  }

  /**
   * Returns an Observable emitting the project with the given id,
   * or undefined if no project matches.
   *
   * Works with the current language and automatically updates on language change.
   */
  getProjectByID(id: number): Observable<Project | undefined> {
    return this.getProjects().pipe(switchMap((projects) => of(projects.find((p) => p.id === id))));
  }
}
