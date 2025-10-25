package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.ParticipacionOrganizacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.ParticipacionOrganizacionResponse;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacion;



public class ParticipacionOrganizacionMapper {

    public static ParticipacionOrganizacion toEntity(
            ParticipacionOrganizacionRequest request,
            Evento evento,
            OrganizacionExterna organizacion
    ) {
        ParticipacionOrganizacion entity = new ParticipacionOrganizacion();

        entity.setIdEvento(request.getIdEvento());
        entity.setIdOrganizacion(request.getIdOrganizacion());

        entity.setCertificadoPdf(request.getCertificadoPdf());

        entity.setRepresentanteDiferente(request.getRepresentanteDiferente());
        entity.setNombreRepresentanteDiferente(request.getNombreRepresentanteDiferente());
        entity.setEvento(evento);
        entity.setOrganizacion(organizacion);

        return entity;
    }

    public static ParticipacionOrganizacionResponse toResponse(ParticipacionOrganizacion entity) {
        ParticipacionOrganizacionResponse response = new ParticipacionOrganizacionResponse();

        response.setIdEvento(entity.getIdEvento());
        response.setIdOrganizacion(entity.getIdOrganizacion());

        response.setCertificadoPdf(entity.getCertificadoPdf());
        response.setRepresentanteDiferente(entity.getRepresentanteDiferente());
        response.setNombreRepresentanteDiferente(entity.getNombreRepresentanteDiferente());

        if (entity.getEvento() != null) {
            response.setNombreEvento(entity.getEvento().getTitulo());
        }

        if (entity.getOrganizacion() != null) {
            response.setNombreOrganizacion(entity.getOrganizacion().getNombre());
        }

        return response;
    }
}
