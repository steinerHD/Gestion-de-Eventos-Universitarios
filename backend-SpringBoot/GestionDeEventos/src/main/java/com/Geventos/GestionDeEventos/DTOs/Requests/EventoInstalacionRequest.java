package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoInstalacionRequest {
    private Long idInstalacion;
    private String horaInicio; // formato "HH:mm:ss"
    private String horaFin;    // formato "HH:mm:ss"
}
