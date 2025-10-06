package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.EventoOrganizador;
import com.Geventos.GestionDeEventos.service.EventoOrganizadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evento-organizadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventoOrganizadorController {
    
    private final EventoOrganizadorService eventoOrganizadorService;
    
    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<EventoOrganizador>> getOrganizadoresByEvento(@PathVariable Long idEvento) {
        List<EventoOrganizador> organizadores = eventoOrganizadorService.getOrganizadoresByEventoId(idEvento);
        return ResponseEntity.ok(organizadores);
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<EventoOrganizador>> getEventosByUsuario(@PathVariable Long idUsuario) {
        List<EventoOrganizador> eventos = eventoOrganizadorService.getEventosByUsuarioId(idUsuario);
        return ResponseEntity.ok(eventos);
    }
    
    @PostMapping
    public ResponseEntity<EventoOrganizador> addOrganizadorToEvento(
            @RequestParam Long idEvento,
            @RequestParam Long idUsuario,
            @RequestParam(required = false) String rolOrganizador) {
        try {
            EventoOrganizador eventoOrganizador = eventoOrganizadorService.addOrganizadorToEvento(
                    idEvento, idUsuario, rolOrganizador);
            return ResponseEntity.status(HttpStatus.CREATED).body(eventoOrganizador);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{idEvento}/{idUsuario}")
    public ResponseEntity<EventoOrganizador> updateRolOrganizador(
            @PathVariable Long idEvento,
            @PathVariable Long idUsuario,
            @RequestParam String nuevoRol) {
        try {
            EventoOrganizador eventoOrganizador = eventoOrganizadorService.updateRolOrganizador(
                    idEvento, idUsuario, nuevoRol);
            return ResponseEntity.ok(eventoOrganizador);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{idEvento}/{idUsuario}")
    public ResponseEntity<Void> removeOrganizadorFromEvento(
            @PathVariable Long idEvento,
            @PathVariable Long idUsuario) {
        try {
            eventoOrganizadorService.removeOrganizadorFromEvento(idEvento, idUsuario);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
