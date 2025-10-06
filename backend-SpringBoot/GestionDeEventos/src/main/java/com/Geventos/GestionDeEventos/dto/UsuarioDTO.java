package com.Geventos.GestionDeEventos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long idUsuario;
    private String nombre;
    private String correo;
    private String tipoUsuario; // "ESTUDIANTE", "DOCENTE", "SECRETARIA_ACADEMICA"
    private String codigoEstudiantil; // Solo para estudiantes
    private String programa; // Solo para estudiantes
    private String unidadAcademica; // Solo para docentes
    private String cargo; // Solo para docentes
    private String facultad; // Solo para secretarias académicas
}
