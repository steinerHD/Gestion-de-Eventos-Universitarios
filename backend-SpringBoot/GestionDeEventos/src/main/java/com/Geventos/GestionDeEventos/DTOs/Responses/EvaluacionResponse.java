package com.Geventos.GestionDeEventos.DTOs.Responses;

import com.Geventos.GestionDeEventos.entity.Evaluacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluacionResponse {
    private Long idEvaluacion;
    private LocalDate fecha;
    private Evaluacion.EstadoEvaluacion estado;
    private String justificacion;
    private String actaPdf;

    // Información resumida de las relaciones
    private Long idEvento;
    private String nombreEvento;

    private Long idSecretaria;
    private String nombreSecretaria;
}
