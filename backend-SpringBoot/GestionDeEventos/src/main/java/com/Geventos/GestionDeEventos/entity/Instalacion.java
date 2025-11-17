package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "instalacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Instalacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instalacion")
    private Long idInstalacion;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "tipo", nullable = false, length = 50)
    private String tipo;
    
    @Column(name = "ubicacion", nullable = false, length = 200)
    private String ubicacion;
    
    @Column(name = "capacidad", nullable = false)
    private Integer capacidad;

    // Relación OneToMany con EventoInstalacion (inversa)
    @JsonIgnore
    @OneToMany(mappedBy = "instalacion")
    private List<EventoInstalacion> eventoInstalaciones;
}
