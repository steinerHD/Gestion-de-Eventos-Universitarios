package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class EstudianteRequest {
    private Long idUsuario;           // ID del usuario existente
    private String codigoEstudiantil;
    private String programa;
}