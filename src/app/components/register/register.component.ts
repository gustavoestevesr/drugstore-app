import { NgIf } from '@angular/common';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
 // Services
 formBuild = inject(FormBuilder);
 snackBar = inject(MatSnackBar);
 authService = inject(AuthService);
 router = inject(Router);

 // Variables
 registerForm!: FormGroup;
 isLoading = false;

 constructor() {
   this.createRegisterForm();
 }

 // Methods
 createRegisterForm() {
   this.registerForm = this.formBuild.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', [Validators.required, Validators.minLength(6)]],
   });
 }

 onSubmit() {
   if (this.registerForm.invalid) {
     this.snackBar.open('Please check your credentials', 'Close', { duration: 3000 });
     this.registerForm.markAllAsTouched();
     return;
   }

   this.isLoading = true;

   const user: IUser = {
    email: this.registerForm.value.email,
    password: this.registerForm.value.password,
    id: 0,
    role: 'user',
    created_at: new Date(),
   }

   this.authService.register(user).subscribe({
     next: (res) => {
       this.snackBar.open('Register successful', 'Close', { duration: 3000 });
       this.router.navigate(['/login']);
     },
     error: (error) => {
       this.snackBar.open('Register failed', 'Close', { duration: 3000 });
       this.isLoading = false;
     },
     complete: () => {
       this.isLoading = false;
     }
   });
 }

 // Getters
 get email() {
   return this.registerForm.get('email');
 }

 get password() {
   return this.registerForm.get('password');
 }
}
