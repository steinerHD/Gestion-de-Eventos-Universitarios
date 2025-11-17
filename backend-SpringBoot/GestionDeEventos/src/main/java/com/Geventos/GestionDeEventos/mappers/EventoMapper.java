package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.EventoRequest;
import com.Geventos.GestionDeEventos.DTOs.Requests.EventoInstalacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoInstalacionResponse;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.EventoInstalacion;
import com.Geventos.GestionDeEventos.entity.EventoInstalacionId;
import com.Geventos.GestionDeEventos.entity.Instalacion;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.entity.EventoOrganizador;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoOrganizadorResponse;

import java.time.LocalTime;
import java.util.List;

public class EventoMapper {

    public static Evento toEntity(EventoRequest request, Usuario organizador) {
        Evento evento = new Evento();
        evento.setTitulo(request.getTitulo());
        evento.setTipoEvento(request.getTipoEvento());
        evento.setFecha(request.getFecha());
        evento.setCapacidad(request.getCapacidad());
        evento.setOrganizador(organizador);
        // eventoInstalaciones se manejan en el servicio
        // organizadores (incluyendo organizador principal y coorganizadores) se manejan en el servicio
        // Si no se especifica estado, establecer como Borrador por defecto
        evento.setEstado(request.getEstado() != null ? request.getEstado() : Evento.EstadoEvento.Borrador);
        return evento;
    }

    public static EventoInstalacion toEventoInstalacion(Evento evento, Instalacion instalacion, EventoInstalacionRequest request) {
        EventoInstalacion ei = new EventoInstalacion();
        EventoInstalacionId id = new EventoInstalacionId(evento.getIdEvento(), instalacion.getIdInstalacion());
        ei.setId(id);
        ei.setEvento(evento);
        ei.setInstalacion(instalacion);
        ei.setHoraInicio(LocalTime.parse(request.getHoraInicio()));
        ei.setHoraFin(LocalTime.parse(request.getHoraFin()));
        return ei;
    }

    public static EventoResponse toResponse(Evento evento) {
        EventoResponse response = new EventoResponse();
        response.setIdEvento(evento.getIdEvento());
        response.setTitulo(evento.getTitulo());
        response.setTipoEvento(evento.getTipoEvento());
        response.setFecha(evento.getFecha());
        response.setCapacidad(evento.getCapacidad());
        response.setFechaCreacion(evento.getFechaCreacion());
        response.setIdOrganizador(evento.getOrganizador() != null ? evento.getOrganizador().getIdUsuario() : null);
        
        // Mapear instalaciones con sus horarios
        response.setInstalaciones(evento.getEventoInstalaciones() != null ?
            evento.getEventoInstalaciones().stream().map(ei -> {
                EventoInstalacionResponse eir = new EventoInstalacionResponse();
                eir.setIdInstalacion(ei.getInstalacion().getIdInstalacion());
                eir.setNombreInstalacion(ei.getInstalacion().getNombre());
                eir.setTipoInstalacion(ei.getInstalacion().getTipo());
                eir.setCapacidadInstalacion(ei.getInstalacion().getCapacidad());
                eir.setHoraInicio(ei.getHoraInicio().toString());
                eir.setHoraFin(ei.getHoraFin().toString());
                return eir;
            }).toList() : List.of());
        
        // Mapear organizadores (organizador + coorganizadores con avals)
        response.setOrganizadores(evento.getOrganizadores() != null ?
            evento.getOrganizadores().stream().map((EventoOrganizador eo) -> {
                EventoOrganizadorResponse r = new EventoOrganizadorResponse();
                r.setIdUsuario(eo.getUsuario() != null ? eo.getUsuario().getIdUsuario() : null);
                r.setAvalPdf(eo.getAvalPdf());
                r.setTipoAval(eo.getTipoAval());
                r.setRol(eo.getRol() != null ? eo.getRol().name() : null);
                return r;
            }).toList() : List.of());
        // tipoAval y avalPdf ahora están por usuario-evento en organizadores
        response.setEstado(evento.getEstado());
        return response;
    }
}
