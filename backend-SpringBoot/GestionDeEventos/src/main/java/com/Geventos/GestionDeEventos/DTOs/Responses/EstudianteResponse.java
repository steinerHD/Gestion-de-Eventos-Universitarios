package com.Geventos.GestionDeEventos.DTOs.Responses;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EstudianteResponse {
    private Long idEstudiante;
    private String codigoEstudiantil;
    private String programa;
    private Long idUsuario;
    private String nombreUsuario;
    private String correoUsuario;
}
