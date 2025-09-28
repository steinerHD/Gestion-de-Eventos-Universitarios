import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="container mt-5">
      <div class="card p-4 mx-auto" style="max-width: 600px;">
        <h3 class="mb-3 text-center">Perfil de Usuario</h3>
        <p class="text-center mb-4">Aquí puedes visualizar y editar tus datos personales.</p>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent {}