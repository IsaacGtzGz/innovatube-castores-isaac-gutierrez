import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  videoSeleccionado: any = null;
  urlSegura: SafeResourceUrl | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (data: any[]) => {
        this.favorites = data;
      },
      error: (err: any) => console.error('Error al cargar favoritos', err)
    });
  }

  quitarFavorito(videoId: string, event: Event): void {
    event.stopPropagation();
    this.favoritesService.removeFavorite(videoId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(v => v.youtube_video_id !== videoId);
      },
      error: (err: any) => console.error('Error al eliminar', err)
    });
  }

  abrirVideo(video: any): void {
    this.videoSeleccionado = video;
    const url = `https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1`;
    this.urlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  cerrarModal(): void {
    this.videoSeleccionado = null;
    this.urlSegura = null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
