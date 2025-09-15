package com.Geventos.GestionDeEventos.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "docente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Docente {
    
    @Id
    @Column(name = "id_docente")
    private Long idDocente;
    
    @Column(name = "unidad_academica", nullable = false, length = 100)
    private String unidadAcademica;
    
    @Column(name = "cargo", length = 50)
    private String cargo;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_docente")
    @MapsId
    @JsonBackReference
    private Usuario usuario;
}
