import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  inscrit = false;
  verifie: '' | 'ok' | 'ko' = '';
  emailNonVerifie = false;
  infoMessage = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    const params = this.route.snapshot.queryParamMap;
    this.inscrit = params.get('inscrit') === '1';
    const v = params.get('verifie');
    this.verifie = v === '1' ? 'ok' : v === '0' ? 'ko' : '';
  }

  renvoyer() {
    if (!this.email) {
      this.errorMessage = 'Saisis ton email pour renvoyer le message de vérification.';
      return;
    }
    this.authService.renvoyerVerification(this.email).subscribe({
      next: (res) => { this.infoMessage = res.message; this.errorMessage = ''; this.cdr.markForCheck(); },
      error: () => { this.errorMessage = 'Envoi impossible pour le moment.'; this.cdr.markForCheck(); },
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.infoMessage = '';
    this.emailNonVerifie = false;
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([this.authService.getHomePath(res.user.role)]);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.errorMessage = 'Serveur injoignable. Vérifie que le backend est lancé.';
        } else if (err.status === 403 && err.error?.code === 'email_non_verifie') {
          this.emailNonVerifie = true;
          this.errorMessage = err.error.message;
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