package com.Geventos.GestionDeEventos.DTOs.Responses;

import lombok.Data;

@Data
public class ParticipacionOrganizacionResponse {
    private Long idEvento;
    private Long idOrganizacion;
    private String certificadoPdf;
    private Boolean representanteDiferente;
    private String nombreRepresentanteDiferente;

    private String nombreEvento; // nombre del evento asociado
    private String nombreOrganizacion; // nombre de la organización externa
}
