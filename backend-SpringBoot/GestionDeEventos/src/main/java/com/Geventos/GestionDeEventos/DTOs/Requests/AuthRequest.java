package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class AuthRequest {
    private String correo;
    private String contrasenaHash;
}