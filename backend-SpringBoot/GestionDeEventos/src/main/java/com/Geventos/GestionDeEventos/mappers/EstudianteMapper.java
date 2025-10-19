package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.EstudianteRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EstudianteResponse;
import com.Geventos.GestionDeEventos.entity.Estudiante;
import com.Geventos.GestionDeEventos.entity.Usuario;

public class EstudianteMapper {

    public static Estudiante toEntity(EstudianteRequest request) {
        Estudiante estudiante = new Estudiante();
        estudiante.setIdEstudiante(request.getIdEstudiante());
        estudiante.setCodigoEstudiantil(request.getCodigoEstudiantil());
        estudiante.setPrograma(request.getPrograma());
        return estudiante;
    }

    public static EstudianteResponse toResponse(Estudiante estudiante) {
        EstudianteResponse response = new EstudianteResponse();
        response.setIdEstudiante(estudiante.getIdEstudiante());
        response.setCodigoEstudiantil(estudiante.getCodigoEstudiantil());
        response.setPrograma(estudiante.getPrograma());

        Usuario usuario = estudiante.getUsuario();
        if (usuario != null) {
            response.setIdUsuario(usuario.getIdUsuario());
            response.setNombreUsuario(usuario.getNombre());
            response.setCorreoUsuario(usuario.getCorreo());
        }
        return response;
    }
}
