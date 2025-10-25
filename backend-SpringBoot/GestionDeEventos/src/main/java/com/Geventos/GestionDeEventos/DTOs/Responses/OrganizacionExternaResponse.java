package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizacionExternaResponse {

    private Long id;
    private String nit;
    private String nombre;
    private String representanteLegal;
    private String telefono;
    private String ubicacion;
    private String sectorEconomico;
    private String actividadPrincipal;
    private Long idCreador;
}
