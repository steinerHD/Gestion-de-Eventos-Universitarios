package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "evento_organizador", uniqueConstraints = {@UniqueConstraint(columnNames = {"id_evento", "id_usuario"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoOrganizador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento_organizador")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento")
    @JsonBackReference(value = "evento-organizadores")
    private Evento evento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonBackReference(value = "usuario-eventosOrganizados")
    private Usuario usuario;

    @Column(name = "aval_pdf")
    private String avalPdf;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_aval", length = 50)
    private Evento.TipoAval tipoAval;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", length = 20, nullable = false)
    private Rol rol;

    public enum Rol {
        ORGANIZADOR, COORGANIZADOR
    }
}
