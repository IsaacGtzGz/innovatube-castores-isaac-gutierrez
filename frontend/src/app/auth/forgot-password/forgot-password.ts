import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPasswordComponent {
  // # Formularios y Estados
  form: FormGroup;
  isLoading = false;
  message = '';

  // # Modal y Seguridad de Token
  showTokenModal = false;
  generatedToken = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // # Enmascarar Token (Estilo Bancario)
  get maskedToken(): string {
    if (!this.generatedToken) return '';
    return '••••-••••-••••-' + this.generatedToken.slice(-4);
  }

  // # Generación de Token
  onSubmit(): void {
    this.message = '';
    if (this.form.valid) {
      this.isLoading = true;
      this.authService.forgotPassword(this.form.value.email).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res && res.token) {
            this.generatedToken = res.token;
            this.showTokenModal = true;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message = err.error?.error || 'Error al procesar la solicitud.';
        }
      });
    }
  }

  // # Autorización y Redirección
  proceedToReset(): void {
    if (this.generatedToken) {
      this.router.navigate(['/reset-password'], { queryParams: { token: this.generatedToken } });
    }
  }
}
