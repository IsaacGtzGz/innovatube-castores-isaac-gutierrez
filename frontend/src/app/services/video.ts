import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Entorno
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Peticiones HTTP
  searchVideos(query: string = 'programacion'): Observable<any> {
    const params = new HttpParams().set('query', query);

    return this.http.get(`${this.apiUrl}/youtube/search`, { params });
  }
}
