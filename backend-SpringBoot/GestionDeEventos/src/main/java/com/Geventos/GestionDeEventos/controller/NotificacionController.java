package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.Notificacion;
import com.Geventos.GestionDeEventos.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificacionController {
    
    private final NotificacionService notificacionService;
    
    @GetMapping
    public ResponseEntity<List<Notificacion>> getAllNotificaciones() {
        List<Notificacion> notificaciones = notificacionService.findAll();
        return ResponseEntity.ok(notificaciones);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Notificacion> getNotificacionById(@PathVariable Long id) {
        Optional<Notificacion> notificacion = notificacionService.findById(id);
        return notificacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/evaluacion/{idEvaluacion}")
    public ResponseEntity<List<Notificacion>> getNotificacionesByEvaluacion(@PathVariable Long idEvaluacion) {
        List<Notificacion> notificaciones = notificacionService.findByEvaluacionId(idEvaluacion);
        return ResponseEntity.ok(notificaciones);
    }
    
    @GetMapping("/fecha")
    public ResponseEntity<List<Notificacion>> getNotificacionesByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<Notificacion> notificaciones = notificacionService.findByFechaEnvioBetween(fechaInicio, fechaFin);
        return ResponseEntity.ok(notificaciones);
    }
    
    @GetMapping("/recientes")
    public ResponseEntity<List<Notificacion>> getNotificacionesRecientes(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fecha) {
        List<Notificacion> notificaciones = notificacionService.findNotificacionesRecientes(fecha);
        return ResponseEntity.ok(notificaciones);
    }
    
    @PostMapping
    public ResponseEntity<Notificacion> createNotificacion(@RequestBody Notificacion notificacion) {
        try {
            Notificacion savedNotificacion = notificacionService.save(notificacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNotificacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Notificacion> updateNotificacion(@PathVariable Long id, @RequestBody Notificacion notificacion) {
        try {
            Notificacion updatedNotificacion = notificacionService.update(id, notificacion);
            return ResponseEntity.ok(updatedNotificacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotificacion(@PathVariable Long id) {
        try {
            notificacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
