package com.Geventos.GestionDeEventos.DTOs.Requests;

import com.Geventos.GestionDeEventos.entity.Evento.EstadoEvento;
import com.Geventos.GestionDeEventos.entity.Evento.TipoEvento;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class EventoRequest {

    private String titulo;
    private TipoEvento tipoEvento;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Long idOrganizador;
    private List<Long> instalaciones; // ids de instalaciones
    // Lista de organizadores (organizador principal + coorganizadores) con su aval (path) y tipo
    private java.util.List<com.Geventos.GestionDeEventos.DTOs.Requests.EventoOrganizadorRequest> organizadores;
    private List<ParticipacionDetalleRequest> participacionesOrganizaciones; // detalles de participaciones
    // Nota: avalPdf y tipoAval ahora se reciben por usuario en 'organizadores'
    private EstadoEvento estado;
}
