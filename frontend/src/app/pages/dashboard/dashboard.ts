import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// Servicios
import { VideoService } from '../../services/video';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  // Estado
  videos: any[] = [];
  favoriteIds: Set<string> = new Set();
  searchInput = new FormControl('');
  username: string = '';

  // Variables del Modal
  videoSeleccionado: any = null;
  urlSegura: SafeResourceUrl | null = null;

  // Inyección de Dependencias
  constructor(
    private router: Router,
    private videoService: VideoService,
    private favoritesService: FavoritesService,
    private sanitizer: DomSanitizer
  ) { }

  // Ciclo de Vida
  ngOnInit(): void {
    this.extraerUsuario();
    this.loadFavorites();
    this.cargarVideos('desarrollo web');
  }

  // Decodificación JWT
  extraerUsuario(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        this.username = decoded.username || 'Usuario';
      } catch (error) {
        this.username = 'Usuario';
      }
    }
  }

  // Eventos de Interfaz
  buscar(): void {
    const termino = this.searchInput.value;
    if (termino && termino.trim() !== '') {
      this.cargarVideos(termino);
    }
  }

  limpiarBusqueda(): void {
    this.searchInput.setValue('');
    this.cargarVideos('desarrollo web');
  }

  toggleFavorite(video: any, event: Event): void {
    event.stopPropagation(); // Evita que se abra el reproductor al dar like
    const videoId = video.youtube_video_id;

    if (this.favoriteIds.has(videoId)) {
      this.favoritesService.removeFavorite(videoId).subscribe({
        next: () => {
          this.favoriteIds.delete(videoId);
        },
        error: (err: any) => console.error('Error al eliminar de favoritos:', err)
      });
    } else {
      const favoriteData = {
        youtube_video_id: videoId,
        title: video.title,
        thumbnail_url: video.thumbnail_url
      };

      this.favoritesService.addFavorite(favoriteData).subscribe({
        next: () => {
          this.favoriteIds.add(videoId);
        },
        error: (err: any) => console.error('Error al agregar a favoritos:', err)
      });
    }
  }

  // Lógica del Reproductor
  abrirVideo(video: any): void {
    this.videoSeleccionado = video;
    const url = `https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1`;
    this.urlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  cerrarModal(): void {
    this.videoSeleccionado = null;
    this.urlSegura = null;
  }

  // Peticiones HTTP
  cargarVideos(query: string): void {
    this.videos = [];

    this.videoService.searchVideos(query).subscribe({
      next: (data: any[]) => {
        this.videos = data;
      },
      error: (err: any) => {
        console.error('Error al cargar la galería:', err);
      }
    });
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (favs: any[]) => {
        const ids = favs.map((f: any) => f.youtube_video_id);
        this.favoriteIds = new Set(ids);
      },
      error: (err: any) => console.error('Error al cargar favoritos:', err)
    });
  }

  // Control de Sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
