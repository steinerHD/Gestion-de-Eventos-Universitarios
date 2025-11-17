package com.Geventos.GestionDeEventos.DTOs.Requests;

import com.Geventos.GestionDeEventos.entity.Evento.EstadoEvento;
import com.Geventos.GestionDeEventos.entity.Evento.TipoEvento;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class EventoRequest {

    private String titulo;
    private TipoEvento tipoEvento;
    private LocalDate fecha;
    private Integer capacidad;
    private Long idOrganizador;
    // Nueva estructura: instalaciones con sus horarios específicos
    private List<EventoInstalacionRequest> instalaciones;
    // Lista de organizadores (organizador principal + coorganizadores) con su aval (path) y tipo
    private java.util.List<com.Geventos.GestionDeEventos.DTOs.Requests.EventoOrganizadorRequest> organizadores;
    private List<ParticipacionDetalleRequest> participacionesOrganizaciones; // detalles de participaciones
    // Nota: avalPdf y tipoAval ahora se reciben por usuario en 'organizadores'
    private EstadoEvento estado;
}
