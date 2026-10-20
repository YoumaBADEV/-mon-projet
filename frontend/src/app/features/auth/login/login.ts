import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
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
        if (err.status === 0) {
          this.errorMessage = 'Serveur injoignable. Vérifie que le backend est lancé.';
        } else if (err.status === 422 && err.error?.errors) {
          this.errorMessage = Object.values(err.error.errors).flat().join(' ');
        } else {
          this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect.';
        }
        this.cdr.markForCheck();
      },
    });
  }
}