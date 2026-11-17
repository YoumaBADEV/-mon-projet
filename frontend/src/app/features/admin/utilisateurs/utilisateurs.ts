import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h3 class="mb-3">Gestion des utilisateurs</h3>

    @if (error) { <div class="alert alert-danger">{{ error }}</div> }

    <select class="form-select w-auto mb-3" [(ngModel)]="filtre">
      <option value="">Tous les rôles</option>
      <option value="agriculteur">Agriculteurs</option>
      <option value="acheteur">Acheteurs</option>
      <option value="admin">Admins</option>
    </select>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-success">
          <tr><th>Nom</th><th>Email</th><th>Rôle</th><th></th></tr>
        </thead>
        <tbody>
          @for (u of filtres(); track u.id) {
            <tr>
              <td>{{ u.prenom }} {{ u.nom || u.name }}</td>
              <td>{{ u.email }}</td>
              <td><span class="badge bg-secondary">{{ u.role }}</span></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" (click)="supprimer(u)">Supprimer</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="4" class="text-center text-muted">Aucun utilisateur</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Utilisateurs implements OnInit {
  private api = 'http://127.0.0.1:8000/api/admin/users';
  users: any[] = [];
  filtre = '';
  error = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.charger(); }

  charger() {
    this.http.get<any[]>(this.api).subscribe({
      next: (data) => { this.users = data; this.cdr.markForCheck(); },
      error: () => { this.error = 'Impossible de charger les utilisateurs.'; this.cdr.markForCheck(); },
    });
  }

  filtres() {
    return this.filtre ? this.users.filter(u => u.role === this.filtre) : this.users;
  }

  supprimer(u: any) {
    if (!confirm(`Supprimer ${u.email} ?`)) return;
    this.http.delete(`${this.api}/${u.id}`).subscribe({
      next: () => { this.users = this.users.filter(x => x.id !== u.id); this.cdr.markForCheck(); },
      error: () => { this.error = 'Suppression impossible.'; this.cdr.markForCheck(); },
    });
  }
}