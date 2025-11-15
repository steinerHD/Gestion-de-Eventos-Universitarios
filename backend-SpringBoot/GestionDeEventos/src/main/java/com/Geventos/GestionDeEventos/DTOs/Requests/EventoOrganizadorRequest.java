package com.Geventos.GestionDeEventos.DTOs.Requests;

import com.Geventos.GestionDeEventos.entity.Evento.TipoAval;
import lombok.Data;

@Data
public class EventoOrganizadorRequest {
    private Long idUsuario;
    private String avalPdf; // path/URL as text
    private TipoAval tipoAval;
    private String rol; // "ORGANIZADOR" or "COORGANIZADOR"
}
