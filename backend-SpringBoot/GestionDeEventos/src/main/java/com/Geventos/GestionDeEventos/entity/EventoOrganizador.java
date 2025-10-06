package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "evento_organizador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoOrganizador {
    
    @EmbeddedId
    private EventoOrganizadorId id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idEvento")
    @JoinColumn(name = "id_evento")
    private Evento evento;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    
    @Column(name = "rol_organizador", nullable = false, length = 50)
    private String rolOrganizador = "Organizador Principal";
    
    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion = LocalDateTime.now();
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventoOrganizadorId implements java.io.Serializable {
        private Long idEvento;
        private Long idUsuario;
    }
}
