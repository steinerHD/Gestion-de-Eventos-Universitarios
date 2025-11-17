package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;

@Data
@Entity
@Table(name = "evento_instalacion")
public class EventoInstalacion {
    
    @EmbeddedId
    private EventoInstalacionId id;
    
    @ManyToOne
    @MapsId("idEvento")
    @JoinColumn(name = "id_evento")
    private Evento evento;
    
    @ManyToOne
    @MapsId("idInstalacion")
    @JoinColumn(name = "id_instalacion")
    private Instalacion instalacion;
    
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;
    
    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;
}
