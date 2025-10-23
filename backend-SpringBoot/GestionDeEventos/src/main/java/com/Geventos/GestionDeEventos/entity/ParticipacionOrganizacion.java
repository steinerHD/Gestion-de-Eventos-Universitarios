package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
@Entity
@Table(name = "participacion_organizacion")
@Data
@EqualsAndHashCode(exclude = { "evento", "organizacion" })
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ParticipacionOrganizacionId.class)
public class ParticipacionOrganizacion implements Serializable {
    
    @Id
    @Column(name = "id_evento")
    private Long idEvento;
    
    @Id
    @Column(name = "id_organizacion")
    private Long idOrganizacion;
    
    @Column(name = "certificado_pdf", nullable = false)
    private String certificadoPdf;
    
    @Column(name = "representante_diferente")
    private Boolean representanteDiferente = false;
    
    @Column(name = "nombre_representante_diferente", length = 150)
    private String nombreRepresentanteDiferente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento", insertable = false, updatable = false)
    @JsonBackReference(value = "evento-organizaciones")
    private Evento evento;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_organizacion", insertable = false, updatable = false)
    private OrganizacionExterna organizacion;
}

