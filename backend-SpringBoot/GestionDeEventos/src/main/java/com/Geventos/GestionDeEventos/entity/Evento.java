package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "evento")
@Data
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

    @Column(name = "horainicio", nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaInicio;

    @Column(name = "horafin", nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaFin;

    @ManyToMany
    @JoinTable(name = "evento_instalacion", joinColumns = @JoinColumn(name = "id_evento"), inverseJoinColumns = @JoinColumn(name = "id_instalacion"))
    private List<Instalacion> instalaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_organizador")
    @JsonBackReference(value = "usuario-eventos")
    private Usuario organizador;

    @Column(name = "aval_pdf")
    private String avalPdf;

    @Convert(converter = TipoAvalConverter.class)
    @Column(name = "tipo_aval", length = 50)
    private TipoAval tipoAval;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoEvento estado;

    @JsonManagedReference(value = "evento-organizaciones")
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParticipacionOrganizacion> participacionesOrganizaciones;

    @JsonIgnore
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Evaluacion> evaluaciones;

    @ManyToMany
    @JoinTable(name = "evento_coorganizador", joinColumns = @JoinColumn(name = "id_evento"), inverseJoinColumns = @JoinColumn(name = "id_usuario"))
    @JsonManagedReference(value = "evento-coorganizadores")
    private List<Usuario> coorganizadores;

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
