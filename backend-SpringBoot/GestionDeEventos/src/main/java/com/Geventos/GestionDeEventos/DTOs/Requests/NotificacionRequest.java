package com.Geventos.GestionDeEventos.DTOs.Requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificacionRequest {

    @NotNull(message = "El ID de la evaluación es obligatorio")
    private Long idEvaluacion;

    @NotBlank(message = "El mensaje no puede estar vacío")
    private String mensaje;
}
