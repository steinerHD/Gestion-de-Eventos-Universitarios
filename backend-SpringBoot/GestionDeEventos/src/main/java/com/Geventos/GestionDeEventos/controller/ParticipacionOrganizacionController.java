package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacion;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacionId;
import com.Geventos.GestionDeEventos.service.ParticipacionOrganizacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<ParticipacionOrganizacion>> getAllParticipacionesOrganizaciones() {
        List<ParticipacionOrganizacion> participaciones = participacionOrganizacionService.findAll();
        return ResponseEntity.ok(participaciones);
    }
    
    @GetMapping("/evento/{idEvento}/organizacion/{idOrganizacion}")
    public ResponseEntity<ParticipacionOrganizacion> getParticipacionOrganizacionById(
            @PathVariable Long idEvento, @PathVariable Long idOrganizacion) {
        ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(idEvento, idOrganizacion);
        Optional<ParticipacionOrganizacion> participacion = participacionOrganizacionService.findById(id);
        return participacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<ParticipacionOrganizacion>> getParticipacionesByEvento(@PathVariable Long idEvento) {
        List<ParticipacionOrganizacion> participaciones = participacionOrganizacionService.findByEventoId(idEvento);
        return ResponseEntity.ok(participaciones);
    }
    
    @GetMapping("/organizacion/{idOrganizacion}")
    public ResponseEntity<List<ParticipacionOrganizacion>> getParticipacionesByOrganizacion(@PathVariable Long idOrganizacion) {
        List<ParticipacionOrganizacion> participaciones = participacionOrganizacionService.findByOrganizacionId(idOrganizacion);
        return ResponseEntity.ok(participaciones);
    }
    
    @GetMapping("/representante-diferente")
    public ResponseEntity<List<ParticipacionOrganizacion>> getParticipacionesConRepresentanteDiferente() {
        List<ParticipacionOrganizacion> participaciones = participacionOrganizacionService.findByRepresentanteDiferenteTrue();
        return ResponseEntity.ok(participaciones);
    }
    
    @PostMapping
    public ResponseEntity<ParticipacionOrganizacion> createParticipacionOrganizacion(@RequestBody ParticipacionOrganizacion participacionOrganizacion) {
        try {
            ParticipacionOrganizacion savedParticipacion = participacionOrganizacionService.save(participacionOrganizacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedParticipacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/evento/{idEvento}/organizacion/{idOrganizacion}")
    public ResponseEntity<ParticipacionOrganizacion> updateParticipacionOrganizacion(
            @PathVariable Long idEvento, @PathVariable Long idOrganizacion, 
            @RequestBody ParticipacionOrganizacion participacionOrganizacion) {
        try {
            ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(idEvento, idOrganizacion);
            ParticipacionOrganizacion updatedParticipacion = participacionOrganizacionService.update(id, participacionOrganizacion);
            return ResponseEntity.ok(updatedParticipacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/evento/{idEvento}/organizacion/{idOrganizacion}")
    public ResponseEntity<Void> deleteParticipacionOrganizacion(
            @PathVariable Long idEvento, @PathVariable Long idOrganizacion) {
        try {
            ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(idEvento, idOrganizacion);
            participacionOrganizacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
}
