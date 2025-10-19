package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.ParticipacionOrganizacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.ParticipacionOrganizacionResponse;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacionId;
import com.Geventos.GestionDeEventos.service.ParticipacionOrganizacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/participaciones-organizaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParticipacionOrganizacionController {

    private final ParticipacionOrganizacionService participacionOrganizacionService;

    @GetMapping
    public ResponseEntity<List<ParticipacionOrganizacionResponse>> getAll() {
        return ResponseEntity.ok(participacionOrganizacionService.findAll());
    }

    @GetMapping("/evento/{idEvento}/organizacion/{idOrganizacion}")
    public ResponseEntity<ParticipacionOrganizacionResponse> getById(
            @PathVariable Long idEvento,
            @PathVariable Long idOrganizacion) {

        ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(idEvento, idOrganizacion);
        Optional<ParticipacionOrganizacionResponse> participacion = participacionOrganizacionService.findById(id);
        return participacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<ParticipacionOrganizacionResponse>> getByEvento(@PathVariable Long idEvento) {
        return ResponseEntity.ok(participacionOrganizacionService.findByEventoId(idEvento));
    }

    @GetMapping("/organizacion/{idOrganizacion}")
    public ResponseEntity<List<ParticipacionOrganizacionResponse>> getByOrganizacion(@PathVariable Long idOrganizacion) {
        return ResponseEntity.ok(participacionOrganizacionService.findByOrganizacionId(idOrganizacion));
    }

    @GetMapping("/representante-diferente")
    public ResponseEntity<List<ParticipacionOrganizacionResponse>> getConRepresentanteDiferente() {
        return ResponseEntity.ok(participacionOrganizacionService.findByRepresentanteDiferenteTrue());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ParticipacionOrganizacionRequest request) {
        try {
            ParticipacionOrganizacionResponse saved = participacionOrganizacionService.save(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/evento/{idEvento}/organizacion/{idOrganizacion}")
    public ResponseEntity<?> update(
            @PathVariable Long idEvento,
            @PathVariable Long idOrganizacion,
            @RequestBody ParticipacionOrganizacionRequest request) {
        try {
            ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(idEvento, idOrganizacion);
            ParticipacionOrganizacionResponse updated = participacionOrganizacionService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/evento/{idEvento}/organizacion/{idOrganizacion}")
    public ResponseEntity<?> delete(
            @PathVariable Long idEvento,
            @PathVariable Long idOrganizacion) {
        try {
            ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(idEvento, idOrganizacion);
            participacionOrganizacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
