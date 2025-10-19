package com.Geventos.GestionDeEventos.DTOs.Responses;

import com.Geventos.GestionDeEventos.entity.Evento.TipoAval;
import com.Geventos.GestionDeEventos.entity.Evento.TipoEvento;
import lombok.Data;

import java.time.LocalDate;
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
    private Long idOrganizador;
    private List<Long> instalaciones; // ids
    private List<Long> coorganizadores; // ids
    private TipoAval tipoAval;

    // Nuevo campo: aval en Base64
    private String avalBase64;
}
