package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.Data;

@Data
public class ParticipacionDetalleResponse {
    private Long idOrganizacion;
    private String nombreOrganizacion;
    private String certificadoPdf;
    private Boolean representanteDiferente;
    private String nombreRepresentanteDiferente;
}
