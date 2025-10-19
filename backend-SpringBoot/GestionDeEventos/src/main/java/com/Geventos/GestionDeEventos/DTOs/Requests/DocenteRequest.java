package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocenteRequest {
    private Long idUsuario;          
    private String unidadAcademica;
    private String cargo;
}
