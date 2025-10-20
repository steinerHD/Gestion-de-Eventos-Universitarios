package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.EventoRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoResponse;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.Instalacion;
import com.Geventos.GestionDeEventos.entity.Usuario;

import java.util.List;

public class EventoMapper {

    public static Evento toEntity(EventoRequest request, Usuario organizador, List<Instalacion> instalaciones, List<Usuario> coorganizadores) {
        Evento evento = new Evento();
        evento.setTitulo(request.getTitulo());
        evento.setTipoEvento(request.getTipoEvento());
        evento.setFecha(request.getFecha());
        evento.setHoraInicio(request.getHoraInicio());
        evento.setHoraFin(request.getHoraFin());
        evento.setOrganizador(organizador);
        evento.setInstalaciones(instalaciones);
        evento.setCoorganizadores(coorganizadores);
        evento.setAvalPdf(request.getAvalPdf());
        evento.setTipoAval(request.getTipoAval());
        evento.setEstado(request.getEstado());
        return evento;
    }

    public static EventoResponse toResponse(Evento evento) {
        EventoResponse response = new EventoResponse();
        response.setIdEvento(evento.getIdEvento());
        response.setTitulo(evento.getTitulo());
        response.setTipoEvento(evento.getTipoEvento());
        response.setFecha(evento.getFecha());
        response.setHoraInicio(evento.getHoraInicio());
        response.setHoraFin(evento.getHoraFin());
        response.setIdOrganizador(evento.getOrganizador() != null ? evento.getOrganizador().getIdUsuario() : null);
        response.setInstalaciones(evento.getInstalaciones() != null ?
            evento.getInstalaciones().stream().map(Instalacion::getIdInstalacion).toList() : List.of());
        response.setCoorganizadores(evento.getCoorganizadores() != null ?
            evento.getCoorganizadores().stream().map(Usuario::getIdUsuario).toList() : List.of());
        response.setOrganizacionesExternas(evento.getParticipacionesOrganizaciones() != null ?
            evento.getParticipacionesOrganizaciones().stream()
                .map(participacion -> participacion.getOrganizacion().getIdOrganizacion())
                .toList() : List.of());
        response.setTipoAval(evento.getTipoAval());
        response.setAvalPdf(evento.getAvalPdf());
        response.setEstado(evento.getEstado());
        return response;
    }
}
