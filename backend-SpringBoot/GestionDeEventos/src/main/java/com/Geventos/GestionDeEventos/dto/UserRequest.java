package com.Geventos.GestionDeEventos.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String nombre;
    private String correo;
    private String contrasenaHash;
}
