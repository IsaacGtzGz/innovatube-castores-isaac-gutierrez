import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Configuración de Formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Autenticación HTTP
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso:', response);

          // Almacenamiento de Sesión
          if (response.token) {
            localStorage.setItem('token', response.token);
            console.log('Token guardado en LocalStorage');
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
