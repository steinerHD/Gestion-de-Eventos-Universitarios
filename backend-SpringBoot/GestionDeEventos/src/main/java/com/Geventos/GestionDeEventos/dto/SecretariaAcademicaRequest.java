package com.Geventos.GestionDeEventos.dto;

import lombok.Data;

@Data
public class SecretariaAcademicaRequest {
    private Long idUsuario; // ID del usuario existente
    private String facultad;
}
