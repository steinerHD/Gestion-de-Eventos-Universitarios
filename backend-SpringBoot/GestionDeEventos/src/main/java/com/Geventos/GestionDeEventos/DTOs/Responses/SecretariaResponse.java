package com.Geventos.GestionDeEventos.DTOs.Responses;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SecretariaResponse {
    private Long idSecretaria;
    private String facultad;
    private String nombreUsuario;
    private String correoUsuario;
}
