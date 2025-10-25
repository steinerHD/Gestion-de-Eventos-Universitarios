package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class ParticipacionDetalleRequest {
    private Long idOrganizacion;
    private String certificadoPdf;
    private Boolean representanteDiferente = false;
    private String nombreRepresentanteDiferente;
}
