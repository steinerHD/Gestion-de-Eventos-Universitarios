package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "organizacion_externa")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizacionExterna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_organizacion", nullable = false, unique = true, length = 100)
    private Long idOrganizacion;

    @Column(name = "NIT", nullable = false, unique = true, length = 150)
    private String nit;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "representante_legal", nullable = false, length = 150)
    private String representanteLegal;

    @Column(name = "telefono", nullable = false, length = 20)
    private String telefono;

    @Column(name = "ubicacion", nullable = false, length = 200)
    private String ubicacion;

    @Column(name = "sector_economico", nullable = false, length = 100)
    private String sectorEconomico;

    @Column(name = "actividad_principal", nullable = false, length = 150)
    private String actividadPrincipal;

    @JsonIgnore
    @OneToMany(mappedBy = "organizacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParticipacionOrganizacion> participaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_creador", nullable = false)
    @JsonBackReference(value = "usuario-organizaciones")
    @JsonIgnore
    private Usuario creador;
}
