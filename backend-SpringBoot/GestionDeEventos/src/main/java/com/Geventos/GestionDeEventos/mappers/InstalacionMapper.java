package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.InstalacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.InstalacionResponse;
import com.Geventos.GestionDeEventos.entity.Instalacion;

public class InstalacionMapper {

    public static Instalacion toEntity(InstalacionRequest request) {
        Instalacion instalacion = new Instalacion();
        instalacion.setNombre(request.getNombre());
        instalacion.setTipo(request.getTipo());
        instalacion.setUbicacion(request.getUbicacion());
        instalacion.setCapacidad(request.getCapacidad());
        return instalacion;
    }

    public static InstalacionResponse toResponse(Instalacion instalacion) {
        InstalacionResponse response = new InstalacionResponse();
        response.setIdInstalacion(instalacion.getIdInstalacion());
        response.setNombre(instalacion.getNombre());
        response.setTipo(instalacion.getTipo());
        response.setUbicacion(instalacion.getUbicacion());
        response.setCapacidad(instalacion.getCapacidad());
        return response;
    }
}
