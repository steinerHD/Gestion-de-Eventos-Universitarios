package com.Geventos.GestionDeEventos.dto;

import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacion;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Base64;

public class ParticipacionOrganizacionCreateDTOTest {

    @Test
    public void testToEntityWithValidBase64() {
        // Arrange
        String testBase64 = Base64.getEncoder().encodeToString("test pdf content".getBytes());
        ParticipacionOrganizacionCreateDTO dto = new ParticipacionOrganizacionCreateDTO();
        dto.setIdEvento(1L);
        dto.setIdOrganizacion(2L);
        dto.setCertificadoPdf(testBase64);
        dto.setRepresentanteDiferente(false);
        dto.setNombreRepresentanteDiferente("Test Representative");

        // Act
        ParticipacionOrganizacion entity = dto.toEntity();

        // Assert
        assertNotNull(entity);
        assertEquals(1L, entity.getIdEvento());
        assertEquals(2L, entity.getIdOrganizacion());
        assertEquals(false, entity.getRepresentanteDiferente());
        assertEquals("Test Representative", entity.getNombreRepresentanteDiferente());
        assertNotNull(entity.getCertificadoPdf());
        assertEquals("test pdf content", new String(entity.getCertificadoPdf()));
    }

    @Test
    public void testToEntityWithEmptyBase64() {
        // Arrange
        ParticipacionOrganizacionCreateDTO dto = new ParticipacionOrganizacionCreateDTO();
        dto.setIdEvento(1L);
        dto.setIdOrganizacion(2L);
        dto.setCertificadoPdf("");

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            dto.toEntity();
        });
        assertEquals("certificadoPdf is required and cannot be empty", exception.getMessage());
    }

    @Test
    public void testToEntityWithNullBase64() {
        // Arrange
        ParticipacionOrganizacionCreateDTO dto = new ParticipacionOrganizacionCreateDTO();
        dto.setIdEvento(1L);
        dto.setIdOrganizacion(2L);
        dto.setCertificadoPdf(null);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            dto.toEntity();
        });
        assertEquals("certificadoPdf is required and cannot be empty", exception.getMessage());
    }

    @Test
    public void testToEntityWithInvalidBase64() {
        // Arrange
        ParticipacionOrganizacionCreateDTO dto = new ParticipacionOrganizacionCreateDTO();
        dto.setIdEvento(1L);
        dto.setIdOrganizacion(2L);
        dto.setCertificadoPdf("invalid-base64-string!");

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            dto.toEntity();
        });
        assertTrue(exception.getMessage().contains("Invalid base64 format for certificadoPdf"));
    }
}
