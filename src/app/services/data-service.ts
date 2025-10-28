import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, shareReplay } from 'rxjs/operators';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private base = 'assets/data/Projects.json'; // folder with personalData.json and projects.json

  // Lazy-initialized observable that caches the HTTP result.
  private projects$?: Observable<Project[]>;

  constructor(private http: HttpClient) {}

  /**
   * Returns an Observable<Project[]> that is:
   * - lazy-initialized (HTTP request created only on first call),
   * - retried up to 3 times on failure,
   * - shared and replayed so multiple subscribers use the same HTTP call,
   * - protected with catchError to return an empty array fallback in case of error.
   *
   * Note: the order of operators matters. Here we retry the HTTP call, then
   * cache the successful result. catchError at the end returns a fallback value.
   */
  getProjects(): Observable<Project[]> {
    if (!this.projects$) {
      this.projects$ = this.http.get<Project[]>(this.base).pipe(
        retry(3), // try up to 3 times on error
        shareReplay({ bufferSize: 1, refCount: true }), // cache + share last value
        catchError((error) => {
          console.error('Error loading projects in DataService', error);
          // fallback: return an empty array typed as Project[]
          return of([] as Project[]);
          // alternative: return of<Project[]>([]);
        })
      );
    }

    return this.projects$!;
  }

  /**
   * Returns an Observable that emits the project with the given id,
   * or undefined if no project matches.
   */
  getProjectByID(id: number): Observable<Project | undefined> {
    return this.getProjects().pipe(map((projects) => projects.find((p) => p.id === id)));
  }
}
