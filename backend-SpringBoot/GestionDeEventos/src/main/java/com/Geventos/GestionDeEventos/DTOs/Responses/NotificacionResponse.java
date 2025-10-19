package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificacionResponse {
    private Long idNotificacion;
    private Long idEvaluacion;
    private String mensaje;
    private LocalDateTime fechaEnvio;
}
