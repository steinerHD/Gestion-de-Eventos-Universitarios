import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  templateUrl: './profile-menu.html',
  styleUrls: ['./profile-menu.css']
})
export class ProfileMenu {
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  goToProfile() {
    console.log('Navegando al perfil...');
    this.router.navigate(['/profile']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  closeMenu() {
    this.close.emit();
  }

}
