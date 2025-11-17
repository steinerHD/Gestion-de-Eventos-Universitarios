package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoInstalacionResponse {
    private Long idInstalacion;
    private String nombreInstalacion;
    private String tipoInstalacion;
    private Integer capacidadInstalacion;
    private String horaInicio;
    private String horaFin;
}
