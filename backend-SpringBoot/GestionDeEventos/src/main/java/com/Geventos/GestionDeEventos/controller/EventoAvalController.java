package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.EventoAval;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.service.EventoAvalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/evento-avales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventoAvalController {
    
    private final EventoAvalService eventoAvalService;
    
    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<EventoAval>> getAvalesByEvento(@PathVariable Long idEvento) {
        List<EventoAval> avales = eventoAvalService.getAvalesByEventoId(idEvento);
        return ResponseEntity.ok(avales);
    }
    
    @GetMapping("/evento/{idEvento}/tipo/{tipoAval}")
    public ResponseEntity<List<EventoAval>> getAvalesByEventoAndTipo(
            @PathVariable Long idEvento,
            @PathVariable Evento.TipoAval tipoAval) {
        List<EventoAval> avales = eventoAvalService.getAvalesByEventoIdAndTipo(idEvento, tipoAval);
        return ResponseEntity.ok(avales);
    }
    
    @GetMapping("/{idAval}")
    public ResponseEntity<EventoAval> getAvalById(@PathVariable Long idAval) {
        Optional<EventoAval> aval = eventoAvalService.getAvalById(idAval);
        return aval.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<EventoAval> addAvalToEvento(
            @RequestParam Long idEvento,
            @RequestParam byte[] avalPdf,
            @RequestParam Evento.TipoAval tipoAval,
            @RequestParam(required = false) String nombreAval) {
        try {
            EventoAval eventoAval = eventoAvalService.addAvalToEvento(idEvento, avalPdf, tipoAval, nombreAval);
            return ResponseEntity.status(HttpStatus.CREATED).body(eventoAval);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{idAval}")
    public ResponseEntity<EventoAval> updateAval(
            @PathVariable Long idAval,
            @RequestParam(required = false) byte[] avalPdf,
            @RequestParam(required = false) Evento.TipoAval tipoAval,
            @RequestParam(required = false) String nombreAval) {
        try {
            EventoAval eventoAval = eventoAvalService.updateAval(idAval, avalPdf, tipoAval, nombreAval);
            return ResponseEntity.ok(eventoAval);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{idAval}/deactivate")
    public ResponseEntity<Void> deactivateAval(@PathVariable Long idAval) {
        try {
            eventoAvalService.deactivateAval(idAval);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{idAval}")
    public ResponseEntity<Void> deleteAval(@PathVariable Long idAval) {
        try {
            eventoAvalService.deleteAval(idAval);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
