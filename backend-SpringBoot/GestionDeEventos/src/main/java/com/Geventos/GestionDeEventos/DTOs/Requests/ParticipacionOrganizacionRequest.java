package com.Geventos.GestionDeEventos.DTOs.Requests;

import lombok.Data;

@Data
public class ParticipacionOrganizacionRequest {
    private Long idEvento;
    private Long idOrganizacion;
    private String certificadoPdfBase64; // PDF codificado en Base64
    private Boolean representanteDiferente;
    private String nombreRepresentanteDiferente;
}
