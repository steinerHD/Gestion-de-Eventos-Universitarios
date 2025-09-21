import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  isEditing = false;

  // Datos simulados: estos vendrán del backend
  user = {
    nombreUsuario: 'Juan Pérez',
    email: 'juan@uao.edu.co',
    tipo: 'estudiante', // 'profesor' | 'secretario' | 'estudiante'
    programa: 'Ingeniería Informática',
    unidad: '',
    facultad: ''
  };

  editData = { ...this.user };

  enableEdit() {
    this.isEditing = true;
  }

  save() {
    // Aquí haríamos la llamada al servicio para guardar cambios en el backend
    this.user = { ...this.user, ...this.editData };
    this.isEditing = false;
  }

  cancel() {
    this.editData = { ...this.user };
    this.isEditing = false;
  }


}
