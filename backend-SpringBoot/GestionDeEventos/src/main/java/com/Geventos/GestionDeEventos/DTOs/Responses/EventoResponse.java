package com.Geventos.GestionDeEventos.DTOs.Responses;

import com.Geventos.GestionDeEventos.entity.Evento.TipoAval;
import com.Geventos.GestionDeEventos.entity.Evento.TipoEvento;
import com.Geventos.GestionDeEventos.entity.Evento.EstadoEvento;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class EventoResponse {

    private Long idEvento;
    private String titulo;
    private TipoEvento tipoEvento;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private LocalDateTime fechaCreacion;
    private Long idOrganizador;
    private List<Long> instalaciones; // ids
    // Lista de organizadores y coorganizadores con su aval (usuario-evento)
    private java.util.List<com.Geventos.GestionDeEventos.DTOs.Responses.EventoOrganizadorResponse> organizadores;
    private List<ParticipacionDetalleResponse> participacionesOrganizaciones; // detalles de participaciones
    private TipoAval tipoAval;
    private String avalPdf;
    private EstadoEvento estado;
}
