package com.Geventos.GestionDeEventos.DTOs.Requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SecretariaRequest {

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long idUsuario;

    @NotNull(message = "La facultad es obligatoria")
    @Size(max = 100, message = "La facultad no puede tener más de 100 caracteres")
    private String facultad;
}
