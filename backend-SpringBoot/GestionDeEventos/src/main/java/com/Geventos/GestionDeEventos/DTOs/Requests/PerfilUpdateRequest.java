package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class PerfilUpdateRequest {
    private String nombre;                 // Usuario.nombre

    // Campos específicos por rol (opcionales)
    private String programa;               // Estudiante.programa
    private String unidadAcademica;        // Docente.unidadAcademica
    private String cargo;                  // Docente.cargo
    private String facultad;               // SecretariaAcademica.facultad
}


