package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "evento_secretaria")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoSecretaria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento_secretaria")
    private Long idEventoSecretaria;
    
    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;
    
    @ManyToOne
    @JoinColumn(name = "id_secretaria", nullable = false)
    private SecretariaAcademica secretaria;
    
    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;
    
    @PrePersist
    protected void onCreate() {
        this.fechaAsignacion = LocalDateTime.now();
    }
}
