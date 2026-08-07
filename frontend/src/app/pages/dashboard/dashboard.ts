import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  constructor(private router: Router) { }

  // Control de Sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
