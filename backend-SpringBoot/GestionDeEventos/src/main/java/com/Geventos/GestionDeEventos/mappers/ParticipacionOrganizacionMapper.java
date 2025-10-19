package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.ParticipacionOrganizacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.ParticipacionOrganizacionResponse;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacion;

import java.util.Base64;

public class ParticipacionOrganizacionMapper {

    public static ParticipacionOrganizacion toEntity(
            ParticipacionOrganizacionRequest request,
            Evento evento,
            OrganizacionExterna organizacion
    ) {
        ParticipacionOrganizacion entity = new ParticipacionOrganizacion();

        entity.setIdEvento(request.getIdEvento());
        entity.setIdOrganizacion(request.getIdOrganizacion());

        if (request.getCertificadoPdfBase64() != null && !request.getCertificadoPdfBase64().isEmpty()) {
            entity.setCertificadoPdf(Base64.getDecoder().decode(request.getCertificadoPdfBase64()));
        }

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

        if (entity.getCertificadoPdf() != null) {
            String base64 = Base64.getEncoder().encodeToString(entity.getCertificadoPdf());
            response.setCertificadoPdfBase64(base64.length() > 50 ? base64.substring(0, 50) + "..." : base64);
        }

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
