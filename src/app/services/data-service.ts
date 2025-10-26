import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private base = 'assets/data'; //folder with personalData.json and projects.json

  constructor(private http: HttpClient) {}

  //take data fron json file and retur an array of Project like as observable
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/Projects.json`);
  }

  //return an project observable if the id is into Project.json
  getProjectById(id: number): Observable<Project | undefined> {
    return this.getProjects().pipe(map((projects) => projects.find((p) => p.id === id)));
  }
}
