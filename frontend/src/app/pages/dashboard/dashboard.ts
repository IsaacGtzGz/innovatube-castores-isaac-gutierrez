import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// Servicios
import { VideoService } from '../../services/video';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  videos: any[] = [];

  // Inyección de Dependencias
  constructor(
    private router: Router,
    private videoService: VideoService
  ) { }

  // Ciclo de Vida
  ngOnInit(): void {
    this.cargarVideos();
  }

  // Peticiones HTTP
  cargarVideos(): void {
    // Llamamos a la nueva función searchVideos
    this.videoService.searchVideos('desarrollo web').subscribe({
      next: (data) => {
        this.videos = data;
        console.log('Respuesta de la API de YouTube:', this.videos);
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
