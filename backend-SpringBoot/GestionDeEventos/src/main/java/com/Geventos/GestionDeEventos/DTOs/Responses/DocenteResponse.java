package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DocenteResponse {
    private String nombreDocente;
    private String unidadAcademica;
    private String cargo;
}
