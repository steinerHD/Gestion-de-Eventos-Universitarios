package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EstudianteResponse {
    private String nombreEstudiante;
    private String codigoEstudiantil;
    private String programa;
}
