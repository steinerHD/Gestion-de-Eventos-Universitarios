package com.Geventos.GestionDeEventos.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "estudiante")
@Data
@EqualsAndHashCode(exclude = { "usuario" })
@NoArgsConstructor
@AllArgsConstructor
public class Estudiante {
    
    @Id
    @Column(name = "id_estudiante")
    private Long idEstudiante;
    
    @Column(name = "codigo_estudiantil", nullable = false, unique = true, length = 20)
    private String codigoEstudiantil;
    
    @Column(name = "programa", nullable = false, length = 100)
    private String programa;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estudiante")
    @MapsId
    @JsonBackReference
    private Usuario usuario;
}
