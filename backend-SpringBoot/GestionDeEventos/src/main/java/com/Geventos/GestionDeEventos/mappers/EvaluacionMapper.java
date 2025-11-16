package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.EvaluacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EvaluacionResponse;
import com.Geventos.GestionDeEventos.entity.Evaluacion;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import org.springframework.stereotype.Component;

@Component
public class EvaluacionMapper {

    public Evaluacion toEntity(EvaluacionRequest request, Evento evento, SecretariaAcademica secretaria) {
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setFecha(request.getFecha());
        evaluacion.setEstado(request.getEstado());
        evaluacion.setJustificacion(request.getJustificacion());
        evaluacion.setActaPdf(request.getActaPdf());
        evaluacion.setEvento(evento);
        evaluacion.setSecretaria(secretaria);
        return evaluacion;
    }

    public EvaluacionResponse toResponse(Evaluacion evaluacion) {
        return EvaluacionResponse.builder()
                .idEvaluacion(evaluacion.getIdEvaluacion())
                .fecha(evaluacion.getFecha())
                .estado(evaluacion.getEstado())
                .justificacion(evaluacion.getJustificacion())
                .actaPdf(evaluacion.getActaPdf())
                .idEvento(evaluacion.getEvento() != null ? evaluacion.getEvento().getIdEvento() : null)
                .nombreEvento(evaluacion.getEvento() != null ? evaluacion.getEvento().getTitulo() : null)
                .idSecretaria(evaluacion.getSecretaria() != null ? evaluacion.getSecretaria().getIdSecretaria() : null)
                .nombreSecretaria(evaluacion.getSecretaria() != null ? evaluacion.getSecretaria().getUsuario().getNombre() : null)
                .build();
    }
}
