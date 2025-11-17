package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class EventoInstalacionId implements Serializable {
    private Long idEvento;
    private Long idInstalacion;
}
