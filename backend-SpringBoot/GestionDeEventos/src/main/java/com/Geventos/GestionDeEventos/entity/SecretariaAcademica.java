package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "secretaria_academica")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecretariaAcademica {
    
    @Id
    @Column(name = "id_secretaria")
    private Long idSecretaria;
    
    @Column(name = "facultad", nullable = false, length = 100)
    private String facultad;
    
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_secretaria")
    @MapsId
    private Usuario usuario;
    
    @OneToMany(mappedBy = "secretaria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Evaluacion> evaluaciones;
}
