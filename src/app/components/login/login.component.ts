import { Component, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Services
  formBuild = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  router = inject(Router);

  // Variables
  loginForm!: FormGroup;
  isLoading = false;

  constructor() {
    this.createLoginForm();
  }

  // Methods
  createLoginForm() {
    this.loginForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please check your credentials', 'Close', { duration: 3000 });
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res) {
          this.snackBar.open('Login successful', 'Close', { duration: 3000 });
          this.router.navigate(['/medicine']);
        } else {
          this.snackBar.open('User not found', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Login failed', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Getters
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}