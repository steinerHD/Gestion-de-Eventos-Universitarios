package com.Geventos.GestionDeEventos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacion;
import java.util.Base64;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipacionOrganizacionCreateDTO {
    
    private Long idEvento;
    private Long idOrganizacion;
    private String certificadoPdf; // Base64 string from frontend
    private Boolean representanteDiferente = false;
    private String nombreRepresentanteDiferente;
    
    /**
     * Converts this DTO to a ParticipacionOrganizacion entity
     * by converting the base64 string to byte array
     */
    public ParticipacionOrganizacion toEntity() {
        ParticipacionOrganizacion participacion = new ParticipacionOrganizacion();
        participacion.setIdEvento(this.idEvento);
        participacion.setIdOrganizacion(this.idOrganizacion);
        participacion.setRepresentanteDiferente(this.representanteDiferente);
        participacion.setNombreRepresentanteDiferente(this.nombreRepresentanteDiferente);
        
        // Convert base64 string to byte array
        if (this.certificadoPdf != null && !this.certificadoPdf.trim().isEmpty()) {
            try {
                byte[] pdfBytes = Base64.getDecoder().decode(this.certificadoPdf);
                participacion.setCertificadoPdf(pdfBytes);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid base64 format for certificadoPdf: " + e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("certificadoPdf is required and cannot be empty");
        }
        
        return participacion;
    }
}
