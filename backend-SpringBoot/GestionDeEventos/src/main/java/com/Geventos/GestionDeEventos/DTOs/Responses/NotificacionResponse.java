package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificacionResponse {
    private Long idNotificacion;
    private Long idEvaluacion;
    private Long idUsuario;
    private String nombreUsuario;
    private String mensaje;
    private Boolean leida;
    private String tipoNotificacion;
    private LocalDateTime fechaEnvio;
}
