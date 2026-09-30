import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  role = '';
  telephone = '';
  localisation = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      role: this.role,
      telephone: this.telephone || undefined,
      localisation: this.localisation || undefined,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.user.role === 'agriculteur') {
          this.router.navigate(['/agriculteur']);
        } else {
          this.router.navigate(['/acheteur']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription.';
      },
    });
  }
}