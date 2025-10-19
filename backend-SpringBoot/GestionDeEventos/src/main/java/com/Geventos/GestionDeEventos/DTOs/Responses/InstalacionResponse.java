package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.Data;

@Data
public class InstalacionResponse {
    private Long idInstalacion;
    private String nombre;
    private String tipo;
    private String ubicacion;
    private Integer capacidad;
}
