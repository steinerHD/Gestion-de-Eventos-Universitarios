package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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
    private LocalDate fecha;
    
    @Column(name = "hora", nullable = false)
    private LocalTime hora;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_instalacion")
    private Instalacion instalacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_organizador")
    private Usuario organizador;
    
    @Lob
    @Column(name = "aval_pdf", nullable = false)
    private byte[] avalPdf;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_aval", nullable = false, length = 50)
    private TipoAval tipoAval;
    
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParticipacionOrganizacion> participacionesOrganizaciones;
    
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Evaluacion> evaluaciones;
    
    public enum TipoEvento {
        Académico, Lúdico
    }
    
    public enum TipoAval {
        Director_Programa, Director_Docencia
    }
}
