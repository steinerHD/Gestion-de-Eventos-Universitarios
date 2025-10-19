package com.Geventos.GestionDeEventos.DTOs.Responses;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocenteResponse {
    private Long idDocente;
    private String nombreUsuario;     // Desde la entidad Usuario
    private String correo;            // Desde la entidad Usuario
    private String unidadAcademica;
    private String cargo;
}
