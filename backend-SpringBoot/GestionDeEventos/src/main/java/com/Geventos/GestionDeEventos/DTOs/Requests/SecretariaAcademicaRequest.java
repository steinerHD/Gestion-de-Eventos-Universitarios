package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class SecretariaAcademicaRequest {
    private Long idUsuario; // ID del usuario existente
    private String facultad;
}
