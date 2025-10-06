package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.Geventos.GestionDeEventos.serializer.TruncatedBase64Serializer;

@Entity
@Table(name = "participacion_organizacion")
@Data
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
    
    @Lob
    @Column(name = "certificado_pdf", nullable = false, columnDefinition = "bytea")
    @JsonSerialize(using = TruncatedBase64Serializer.class)
    private byte[] certificadoPdf;
    
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

