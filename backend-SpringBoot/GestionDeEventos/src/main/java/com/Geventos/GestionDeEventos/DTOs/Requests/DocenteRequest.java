package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class DocenteRequest {
    private Long idUsuario; // ID del usuario existente
    private String unidadAcademica;
    private String cargo;
}
