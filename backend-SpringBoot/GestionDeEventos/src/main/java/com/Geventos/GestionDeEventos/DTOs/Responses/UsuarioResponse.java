package com.Geventos.GestionDeEventos.DTOs.Responses;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsuarioResponse {
    private Long idUsuario;
    private String nombre;
    private String correo;

    // Respuestas específicas según el tipo de usuario
    private EstudianteResponse estudiante;
    private DocenteResponse docente;
    private SecretariaResponse secretaria;

    // Roles en eventos
    private List<Long> eventosOrganizados;   // ids de eventos
    
}
