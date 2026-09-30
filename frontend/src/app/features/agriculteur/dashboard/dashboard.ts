import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  userName = '';

  constructor(private authService: Auth, private router: Router) {
    const user = this.authService.getUser();
    this.userName = user?.name || '';
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}