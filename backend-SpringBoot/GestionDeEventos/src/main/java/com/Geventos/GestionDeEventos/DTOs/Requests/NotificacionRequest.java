package com.Geventos.GestionDeEventos.DTOs.Requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificacionRequest {

    private Long idEvaluacion; // Opcional, solo para notificaciones de evaluación

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long idUsuario;

    @NotBlank(message = "El mensaje no puede estar vacío")
    private String mensaje;
    
    private Boolean leida;
    
    private String tipoNotificacion; // EVENTO_CREADO, EVENTO_APROBADO, EVENTO_RECHAZADO
}
