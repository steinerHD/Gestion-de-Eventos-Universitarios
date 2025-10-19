package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.SecretariaRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.SecretariaResponse;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.entity.Usuario;


public class SecretariaMapper {
    

    // Convierte un Request a una entidad
    public static SecretariaAcademica toEntity(SecretariaRequest request, Usuario usuario) {
        SecretariaAcademica secretaria = new SecretariaAcademica();
        secretaria.setUsuario(usuario);
        secretaria.setFacultad(request.getFacultad());
        return secretaria;
    }

    // Convierte una entidad a un Response
    public static SecretariaResponse toResponse(SecretariaAcademica secretaria) {
        return SecretariaResponse.builder()
                .idSecretaria(secretaria.getIdSecretaria())
                .facultad(secretaria.getFacultad())
                .nombreUsuario(secretaria.getUsuario() != null ? secretaria.getUsuario().getNombre() : null)
                .correoUsuario(secretaria.getUsuario() != null ? secretaria.getUsuario().getCorreo() : null)
                .build();
    }
}
