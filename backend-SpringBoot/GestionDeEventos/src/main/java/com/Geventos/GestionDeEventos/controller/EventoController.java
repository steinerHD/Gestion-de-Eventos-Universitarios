package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventoController {
    
    private final EventoService eventoService;
    
    @GetMapping
    public ResponseEntity<List<Evento>> getAllEventos() {
        List<Evento> eventos = eventoService.findAll();
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        Optional<Evento> evento = eventoService.findById(id);
        return evento.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tipo/{tipoEvento}")
    public ResponseEntity<List<Evento>> getEventosByTipo(@PathVariable Evento.TipoEvento tipoEvento) {
        List<Evento> eventos = eventoService.findByTipoEvento(tipoEvento);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Evento>> getEventosByFecha(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Evento> eventos = eventoService.findByFecha(fecha);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/fecha")
    public ResponseEntity<List<Evento>> getEventosByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<Evento> eventos = eventoService.findByFechaBetween(fechaInicio, fechaFin);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/organizador/{idOrganizador}")
    public ResponseEntity<List<Evento>> getEventosByOrganizador(@PathVariable Long idOrganizador) {
        List<Evento> eventos = eventoService.findByOrganizadorId(idOrganizador);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/instalacion/{idInstalacion}")
    public ResponseEntity<List<Evento>> getEventosByInstalacion(@PathVariable Long idInstalacion) {
        List<Evento> eventos = eventoService.findByInstalacionId(idInstalacion);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/titulo/{titulo}")
    public ResponseEntity<List<Evento>> getEventosByTitulo(@PathVariable String titulo) {
        List<Evento> eventos = eventoService.findByTituloContaining(titulo);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/futuros")
    public ResponseEntity<List<Evento>> getEventosFuturos(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Evento> eventos = eventoService.findEventosFuturos(fecha);
        return ResponseEntity.ok(eventos);
    }
    
    @PostMapping
    public ResponseEntity<Evento> createEvento(@RequestBody Evento evento) {
        try {
            Evento savedEvento = eventoService.save(evento);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Evento> updateEvento(@PathVariable Long id, @RequestBody Evento evento) {
        try {
            Evento updatedEvento = eventoService.update(id, evento);
            return ResponseEntity.ok(updatedEvento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        try {
            eventoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
