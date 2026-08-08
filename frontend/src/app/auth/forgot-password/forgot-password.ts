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
  form: FormGroup;
  isLoading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.authService.forgotPassword(this.form.value.email).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res && res.token) {
            this.router.navigate(['/reset-password'], { queryParams: { token: res.token } });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message = err.error?.error || 'Error al procesar la solicitud.';
        }
      });
    }
  }
}
