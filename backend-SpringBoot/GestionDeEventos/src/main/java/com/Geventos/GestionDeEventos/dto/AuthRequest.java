package com.Geventos.GestionDeEventos.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String correo;
    private String contrasenaHash;
}