package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocenteRequest {
    private Long idDocente;          // Coincide con idUsuario en la mayoría de casos
    private String unidadAcademica;
    private String cargo;
}
