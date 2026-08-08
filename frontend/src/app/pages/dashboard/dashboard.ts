import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// Servicios
import { VideoService } from '../../services/video';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  videos: any[] = [];
  searchInput = new FormControl('');

  // Variables del Modal
  videoSeleccionado: any = null;
  urlSegura: SafeResourceUrl | null = null;

  // Inyección de Dependencias
  constructor(
    private router: Router,
    private videoService: VideoService,
    private sanitizer: DomSanitizer
  ) { }

  // Ciclo de Vida
  ngOnInit(): void {
    this.cargarVideos('desarrollo web');
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

  // Lógica del Reproductor
  abrirVideo(video: any): void {
    this.videoSeleccionado = video;
    // Armamos la URL de incrustación de YouTube y la sanitizamos
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
      next: (data) => {
        this.videos = data;
      },
      error: (err) => {
        console.error('Error al cargar la galería:', err);
      }
    });
  }

  // Control de Sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
