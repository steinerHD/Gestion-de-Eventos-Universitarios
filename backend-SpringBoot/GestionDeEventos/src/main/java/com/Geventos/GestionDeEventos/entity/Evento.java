package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "evento")
@Data
@EqualsAndHashCode(exclude = { "participacionesOrganizaciones", "evaluaciones", "organizadores", "eventoInstalaciones" })
@NoArgsConstructor
@AllArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Long idEvento;

    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_evento", nullable = false, length = 20)
    private TipoEvento tipoEvento;

    @Column(name = "fecha", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;

    @Column(name = "capacidad")
    private Integer capacidad;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // Relación con instalaciones a través de EventoInstalacion (incluye horarios)
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EventoInstalacion> eventoInstalaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_organizador")
    @JsonBackReference(value = "usuario-eventos")
    private Usuario organizador;

    // El aval ahora se guarda en la relación entre usuario y evento

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoEvento estado;

    @JsonManagedReference(value = "evento-organizaciones")
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParticipacionOrganizacion> participacionesOrganizaciones;

    @JsonIgnore
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Evaluacion> evaluaciones;

    @JsonManagedReference(value = "evento-organizadores")
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventoOrganizador> organizadores;

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }

    public enum TipoEvento {
        Académico, Lúdico
    }

    public enum TipoAval {
        Director_Programa, Director_Docencia
    }

    public enum EstadoEvento {
        Aprobado, Rechazado, Pendiente, Borrador
    }

}
