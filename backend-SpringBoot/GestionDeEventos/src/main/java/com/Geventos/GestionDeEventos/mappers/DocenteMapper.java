package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.DocenteRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.DocenteResponse;
import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.entity.Usuario;

public class DocenteMapper {

    // 🔹 Convierte de entidad a respuesta DTO
    public static DocenteResponse toResponse(Docente docente) {
        Usuario usuario = docente.getUsuario();
        return new DocenteResponse(
                docente.getIdDocente(),
                usuario != null ? usuario.getNombre() : null,
                usuario != null ? usuario.getCorreo() : null,
                docente.getUnidadAcademica(),
                docente.getCargo()
        );
    }

    // 🔹 Convierte de request DTO a entidad
    public static Docente toEntity(DocenteRequest request) {
        Docente docente = new Docente();
        docente.setIdDocente(request.getIdUsuario());
        docente.setUnidadAcademica(request.getUnidadAcademica());
        docente.setCargo(request.getCargo());
        return docente;
    }
}
