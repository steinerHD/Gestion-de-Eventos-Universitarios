package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstudianteRequest {
    private Long idUsuario;         // Id del usuario asociado
    private String codigoEstudiantil;
    private String programa;
}
