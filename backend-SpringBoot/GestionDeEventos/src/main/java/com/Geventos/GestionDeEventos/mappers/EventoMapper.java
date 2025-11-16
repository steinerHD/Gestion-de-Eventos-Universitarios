package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.EventoRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.ParticipacionDetalleResponse;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.Instalacion;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.entity.EventoOrganizador;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoOrganizadorResponse;

import java.util.List;

public class EventoMapper {

    public static Evento toEntity(EventoRequest request, Usuario organizador, List<Instalacion> instalaciones) {
        Evento evento = new Evento();
        evento.setTitulo(request.getTitulo());
        evento.setTipoEvento(request.getTipoEvento());
        evento.setFecha(request.getFecha());
        evento.setHoraInicio(request.getHoraInicio());
        evento.setHoraFin(request.getHoraFin());
        evento.setOrganizador(organizador);
        evento.setInstalaciones(instalaciones);
        // organizadores (incluyendo organizador principal y coorganizadores) se manejan en el servicio
        // Si no se especifica estado, establecer como Borrador por defecto
        evento.setEstado(request.getEstado() != null ? request.getEstado() : Evento.EstadoEvento.Borrador);
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
        response.setFechaCreacion(evento.getFechaCreacion());
        response.setIdOrganizador(evento.getOrganizador() != null ? evento.getOrganizador().getIdUsuario() : null);
        response.setInstalaciones(evento.getInstalaciones() != null ?
            evento.getInstalaciones().stream().map(Instalacion::getIdInstalacion).toList() : List.of());
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
        response.setParticipacionesOrganizaciones(evento.getParticipacionesOrganizaciones() != null ?
            evento.getParticipacionesOrganizaciones().stream()
                .map(participacion -> {
                    ParticipacionDetalleResponse participacionResponse = new ParticipacionDetalleResponse();
                    participacionResponse.setIdOrganizacion(participacion.getIdOrganizacion());
                    participacionResponse.setNombreOrganizacion(participacion.getOrganizacion() != null ? 
                        participacion.getOrganizacion().getNombre() : null);
                    participacionResponse.setCertificadoPdf(participacion.getCertificadoPdf());
                    participacionResponse.setRepresentanteDiferente(participacion.getRepresentanteDiferente());
                    participacionResponse.setNombreRepresentanteDiferente(participacion.getNombreRepresentanteDiferente());
                    return participacionResponse;
                })
                .toList() : List.of());
        // tipoAval y avalPdf ahora están por usuario-evento en organizadores
        response.setEstado(evento.getEstado());
        return response;
    }
}
