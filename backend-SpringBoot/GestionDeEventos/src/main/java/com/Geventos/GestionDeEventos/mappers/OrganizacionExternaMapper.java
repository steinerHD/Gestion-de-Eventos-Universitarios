package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.OrganizacionExternaRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.OrganizacionExternaResponse;
import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;

public class OrganizacionExternaMapper {

    public static OrganizacionExterna toEntity(OrganizacionExternaRequest request) {
        OrganizacionExterna organizacion = new OrganizacionExterna();
        organizacion.setNit(request.getNit());
        organizacion.setNombre(request.getNombre());
        organizacion.setRepresentanteLegal(request.getRepresentanteLegal());
        organizacion.setTelefono(request.getTelefono());
        organizacion.setUbicacion(request.getUbicacion());
        organizacion.setSectorEconomico(request.getSectorEconomico());
        organizacion.setActividadPrincipal(request.getActividadPrincipal());
        return organizacion;
    }

    public static OrganizacionExternaResponse toResponse(OrganizacionExterna organizacion) {
        OrganizacionExternaResponse response = new OrganizacionExternaResponse();
        response.setId(organizacion.getIdOrganizacion());
        response.setNit(organizacion.getNit());
        response.setNombre(organizacion.getNombre());
        response.setRepresentanteLegal(organizacion.getRepresentanteLegal());
        response.setTelefono(organizacion.getTelefono());
        response.setUbicacion(organizacion.getUbicacion());
        response.setSectorEconomico(organizacion.getSectorEconomico());
        response.setActividadPrincipal(organizacion.getActividadPrincipal());
        return response;
    }
}
