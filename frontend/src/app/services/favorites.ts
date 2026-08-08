import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) { }

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addFavorite(videoData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, videoData);
  }

  removeFavorite(videoId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${videoId}`);
  }
}
