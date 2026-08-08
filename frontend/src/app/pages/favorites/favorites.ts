import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// Servicios
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit {
  // Estado
  favorites: any[] = [];
  filteredFavorites: any[] = [];
  searchInput = new FormControl('');
  username: string = '';

  // Variables del Modal
  videoSeleccionado: any = null;
  urlSegura: SafeResourceUrl | null = null;

  // Inyección de Dependencias
  constructor(
    private favoritesService: FavoritesService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  // Ciclo de Vida
  ngOnInit(): void {
    this.extraerUsuario();
    this.cargarFavoritos();

    // Filtro Reactivo Local
    this.searchInput.valueChanges.subscribe(value => {
      this.filtrarLocal(value || '');
    });
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

  // Peticiones HTTP
  cargarFavoritos(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (data: any[]) => {
        this.favorites = data;
        this.filteredFavorites = data;
      },
      error: (err: any) => console.error('Error al cargar favoritos', err)
    });
  }

  // Lógica de Buscador Local
  filtrarLocal(termino: string): void {
    if (!termino.trim()) {
      this.filteredFavorites = [...this.favorites];
      return;
    }
    const lowerTerm = termino.toLowerCase();
    this.filteredFavorites = this.favorites.filter(v =>
      v.title.toLowerCase().includes(lowerTerm)
    );
  }

  limpiarBusqueda(): void {
    this.searchInput.setValue('');
  }

  // Operaciones de Usuario
  quitarFavorito(videoId: string, event: Event): void {
    event.stopPropagation();
    this.favoritesService.removeFavorite(videoId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(v => v.youtube_video_id !== videoId);
        this.filtrarLocal(this.searchInput.value || '');
      },
      error: (err: any) => console.error('Error al eliminar', err)
    });
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

  // Control de Sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
