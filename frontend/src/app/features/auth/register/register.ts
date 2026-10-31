import { ChangeDetectorRef, Component } from '@angular/core';
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
  nom = '';
  prenom = '';
  email = '';
  password = '';
  password_confirmation = '';
  role = '';
  telephone = '';
  localisation = '';
  adresse = '';
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

    this.authService.register({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      role: this.role,
      telephone: this.telephone || undefined,
      localisation: this.localisation || undefined,
      adresse: this.adresse || undefined,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([this.authService.getHomePath(res.user.role)]);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.errorMessage = 'Serveur injoignable. Vérifie que le backend est lancé.';
        } else {
          const errors = err.error?.errors;
          this.errorMessage = errors
            ? Object.values(errors).flat().join(' ')
            : err.error?.message || "Erreur lors de l'inscription.";
        }
        this.cdr.markForCheck();
      },
    });
  }
}