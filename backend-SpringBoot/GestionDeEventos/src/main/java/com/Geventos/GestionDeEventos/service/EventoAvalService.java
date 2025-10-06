package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.EventoAval;
import com.Geventos.GestionDeEventos.repository.EventoAvalRepository;
import com.Geventos.GestionDeEventos.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventoAvalService {
    
    private final EventoAvalRepository eventoAvalRepository;
    private final EventoRepository eventoRepository;
    
    public List<EventoAval> getAvalesByEventoId(Long idEvento) {
        return eventoAvalRepository.findByEventoIdAndActivo(idEvento);
    }
    
    public List<EventoAval> getAvalesByEventoIdAndTipo(Long idEvento, EventoAval.TipoAval tipoAval) {
        return eventoAvalRepository.findByEventoIdAndTipoAval(idEvento, tipoAval);
    }
    
    @Transactional
    public EventoAval addAvalToEvento(Long idEvento, byte[] avalPdf, EventoAval.TipoAval tipoAval, String nombreAval) {
        // Verificar que el evento existe
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));
        
        // Validar datos
        if (avalPdf == null || avalPdf.length == 0) {
            throw new IllegalArgumentException("El archivo PDF del aval es obligatorio");
        }
        if (tipoAval == null) {
            throw new IllegalArgumentException("El tipo de aval es obligatorio");
        }
        
        // Crear nuevo aval
        EventoAval eventoAval = new EventoAval();
        eventoAval.setEvento(evento);
        eventoAval.setAvalPdf(avalPdf);
        eventoAval.setTipoAval(tipoAval);
        eventoAval.setNombreAval(nombreAval);
        eventoAval.setActivo(true);
        
        return eventoAvalRepository.save(eventoAval);
    }
    
    @Transactional
    public EventoAval updateAval(Long idAval, byte[] avalPdf, EventoAval.TipoAval tipoAval, String nombreAval) {
        EventoAval eventoAval = eventoAvalRepository.findById(idAval)
                .orElseThrow(() -> new IllegalArgumentException("Aval no encontrado"));
        
        if (avalPdf != null && avalPdf.length > 0) {
            eventoAval.setAvalPdf(avalPdf);
        }
        if (tipoAval != null) {
            eventoAval.setTipoAval(tipoAval);
        }
        if (nombreAval != null) {
            eventoAval.setNombreAval(nombreAval);
        }
        
        return eventoAvalRepository.save(eventoAval);
    }
    
    @Transactional
    public void deactivateAval(Long idAval) {
        EventoAval eventoAval = eventoAvalRepository.findById(idAval)
                .orElseThrow(() -> new IllegalArgumentException("Aval no encontrado"));
        
        eventoAval.setActivo(false);
        eventoAvalRepository.save(eventoAval);
    }
    
    @Transactional
    public void deleteAval(Long idAval) {
        if (!eventoAvalRepository.existsById(idAval)) {
            throw new IllegalArgumentException("Aval no encontrado");
        }
        eventoAvalRepository.deleteById(idAval);
    }
    
    public Optional<EventoAval> getAvalById(Long idAval) {
        return eventoAvalRepository.findById(idAval);
    }
}
