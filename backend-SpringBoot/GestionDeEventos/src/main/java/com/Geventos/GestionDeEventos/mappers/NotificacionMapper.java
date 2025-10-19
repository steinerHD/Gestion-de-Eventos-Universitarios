package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.NotificacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.NotificacionResponse;
import com.Geventos.GestionDeEventos.entity.Evaluacion;
import com.Geventos.GestionDeEventos.entity.Notificacion;

public class NotificacionMapper {

    public static Notificacion toEntity(NotificacionRequest request, Evaluacion evaluacion) {
        Notificacion notificacion = new Notificacion();
        notificacion.setEvaluacion(evaluacion);
        notificacion.setMensaje(request.getMensaje());
        return notificacion;
    }

    public static NotificacionResponse toResponse(Notificacion notificacion) {
        NotificacionResponse response = new NotificacionResponse();
        response.setIdNotificacion(notificacion.getIdNotificacion());
        response.setIdEvaluacion(notificacion.getEvaluacion().getIdEvaluacion());
        response.setMensaje(notificacion.getMensaje());
        response.setFechaEnvio(notificacion.getFechaEnvio());
        return response;
    }
}
