package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombre;
    private String correo;
    private String contrasenaHash;
}
