package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.NotificacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.NotificacionResponse;
import com.Geventos.GestionDeEventos.entity.Evaluacion;
import com.Geventos.GestionDeEventos.entity.Notificacion;
import com.Geventos.GestionDeEventos.entity.Usuario;

public class NotificacionMapper {

    public static Notificacion toEntity(NotificacionRequest request, Usuario usuario, Evaluacion evaluacion) {
        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(usuario);
        notificacion.setEvaluacion(evaluacion);
        notificacion.setMensaje(request.getMensaje());
        notificacion.setLeida(request.getLeida() != null ? request.getLeida() : false);
        if (request.getTipoNotificacion() != null) {
            notificacion.setTipoNotificacion(Notificacion.TipoNotificacion.valueOf(request.getTipoNotificacion()));
        }
        return notificacion;
    }

    public static NotificacionResponse toResponse(Notificacion notificacion) {
        NotificacionResponse response = new NotificacionResponse();
        response.setIdNotificacion(notificacion.getIdNotificacion());
        response.setIdEvaluacion(notificacion.getEvaluacion() != null ? notificacion.getEvaluacion().getIdEvaluacion() : null);
        response.setIdUsuario(notificacion.getUsuario() != null ? notificacion.getUsuario().getIdUsuario() : null);
        response.setNombreUsuario(notificacion.getUsuario() != null ? notificacion.getUsuario().getNombre() : null);
        response.setMensaje(notificacion.getMensaje());
        response.setLeida(notificacion.getLeida());
        response.setTipoNotificacion(notificacion.getTipoNotificacion() != null ? notificacion.getTipoNotificacion().name() : null);
        response.setFechaEnvio(notificacion.getFechaEnvio());
        return response;
    }
}
