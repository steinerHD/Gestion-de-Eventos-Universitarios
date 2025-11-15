package com.Geventos.GestionDeEventos.DTOs.Responses;

import com.Geventos.GestionDeEventos.entity.Evento.TipoAval;
import lombok.Data;

@Data
public class EventoOrganizadorResponse {
    private Long idUsuario;
    private String avalPdf;
    private TipoAval tipoAval;
    private String rol; // "ORGANIZADOR" or "COORGANIZADOR"
}
