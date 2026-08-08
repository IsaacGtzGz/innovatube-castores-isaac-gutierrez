import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {
  // Estado del Formulario
  form: FormGroup;
  token: string | null = null;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Ciclo de Vida
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  // Interfaz
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Peticiones HTTP
  onSubmit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Token no válido o ausente.';
      return;
    }

    this.isLoading = true;
    const newPassword = this.form.value.password;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Error al actualizar la contraseña. Por favor intenta de nuevo.';
      }
    });
  }
}
