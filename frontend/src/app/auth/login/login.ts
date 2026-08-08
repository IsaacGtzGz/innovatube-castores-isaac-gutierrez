import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// Servicios
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Configuración de Formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Construcción del Payload
      const payload = {
        identifier: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      // Autenticación HTTP
      this.authService.login(payload).subscribe({
        next: (response) => {
          if (response.token) {
            // Almacenamiento de Sesión y Redirección
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
