package com.Geventos.GestionDeEventos.DTOs.Requests;

import com.Geventos.GestionDeEventos.entity.Evaluacion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluacionRequest {
    private LocalDate fecha;
    private Evaluacion.EstadoEvaluacion estado;
    private String justificacion;
    private String actaPdf;
    private Long idEvento;
    private Long idSecretaria;
}
