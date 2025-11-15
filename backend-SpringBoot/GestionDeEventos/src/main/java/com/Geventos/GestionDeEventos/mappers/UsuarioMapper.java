package com.Geventos.GestionDeEventos.mappers;

import com.Geventos.GestionDeEventos.DTOs.Requests.UsuarioRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.DocenteResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.EstudianteResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.SecretariaResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.UsuarioResponse;
import com.Geventos.GestionDeEventos.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequest request) {
        if (request == null) return null;

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setContrasenaHash(request.getContrasenaHash());
        return usuario;
    }

    public UsuarioResponse toResponse(Usuario usuario) {
        if (usuario == null) return null;

        UsuarioResponse response = new UsuarioResponse();
        response.setIdUsuario(usuario.getIdUsuario());
        response.setNombre(usuario.getNombre());
        response.setCorreo(usuario.getCorreo());
        if (usuario.getEstudiante() != null) {
            EstudianteResponse est = new EstudianteResponse();
            est.setCodigoEstudiantil(usuario.getEstudiante().getCodigoEstudiantil());
            est.setPrograma(usuario.getEstudiante().getPrograma());
            response.setEstudiante(est);
        }

        if (usuario.getDocente() != null) {
            DocenteResponse doc = new DocenteResponse();
            doc.setUnidadAcademica(usuario.getDocente().getUnidadAcademica());
            doc.setCargo(usuario.getDocente().getCargo());
            response.setDocente(doc);
        }

        if (usuario.getSecretariaAcademica() != null) {
            SecretariaResponse sec = new SecretariaResponse();
            sec.setFacultad(usuario.getSecretariaAcademica().getFacultad());
            response.setSecretaria(sec);
        }

        if (usuario.getEventosOrganizados() != null && !usuario.getEventosOrganizados().isEmpty()) {
            response.setEventosOrganizados(
                usuario.getEventosOrganizados().stream()
                        .map(eo -> eo.getEvento() != null ? eo.getEvento().getIdEvento() : null)
                        .toList()
            );
        }

        return response;
    }
}
