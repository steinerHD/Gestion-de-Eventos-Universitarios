import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})

export class ProfileComponent {

  userData: any = {
    nombre: 'Pepito Alberto Diaz Castillo',
    tipoUsuario: 'Estudiante',
    rolCuenta: 'Estudiante',
    email: 'Pepito@U.edu.co',
    facultad: 'Ingeniería',
    codigoEstudiantil: 'I0000000'
  };

}
