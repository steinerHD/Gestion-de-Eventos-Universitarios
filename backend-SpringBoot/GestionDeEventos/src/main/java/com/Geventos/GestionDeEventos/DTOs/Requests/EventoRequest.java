package com.Geventos.GestionDeEventos.DTOs.Requests;

import com.Geventos.GestionDeEventos.entity.Evento.EstadoEvento;
import com.Geventos.GestionDeEventos.entity.Evento.TipoAval;
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
    private List<Long> coorganizadores; // ids de usuarios
    private List<Long> organizacionesExternas; // ids de organizaciones externas
    private String avalPdf;
    private TipoAval tipoAval;
    private EstadoEvento estado;
}
