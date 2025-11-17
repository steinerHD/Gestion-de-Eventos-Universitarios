package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notificacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Long idNotificacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion")
    private Evaluacion evaluacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    
    @Column(name = "mensaje", nullable = false, columnDefinition = "TEXT")
    private String mensaje;
    
    @Column(name = "leida", nullable = false)
    private Boolean leida = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_notificacion", length = 50)
    private TipoNotificacion tipoNotificacion;
    
    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;
    
    @PrePersist
    protected void onCreate() {
        fechaEnvio = LocalDateTime.now();
        if (leida == null) {
            leida = false;
        }
    }
    
    public enum TipoNotificacion {
        EVENTO_CREADO, EVENTO_APROBADO, EVENTO_RECHAZADO
    }
}
