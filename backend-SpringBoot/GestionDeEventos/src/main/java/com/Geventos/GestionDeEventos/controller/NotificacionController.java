package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.NotificacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.NotificacionResponse;
import com.Geventos.GestionDeEventos.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<NotificacionResponse>> getAllNotificaciones() {
        return ResponseEntity.ok(notificacionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotificacionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(notificacionService.findById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/evaluacion/{idEvaluacion}")
    public ResponseEntity<List<NotificacionResponse>> getNotificacionesByEvaluacion(@PathVariable Long idEvaluacion) {
        return ResponseEntity.ok(notificacionService.findByEvaluacionId(idEvaluacion));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<NotificacionResponse>> getNotificacionesByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return ResponseEntity.ok(notificacionService.findByFechaEnvioBetween(fechaInicio, fechaFin));
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<NotificacionResponse>> getNotificacionesRecientes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fecha) {
        return ResponseEntity.ok(notificacionService.findNotificacionesRecientes(fecha));
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<NotificacionResponse>> getNotificacionesByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(notificacionService.findByUsuarioId(idUsuario));
    }
    
    @GetMapping("/usuario/{idUsuario}/no-leidas")
    public ResponseEntity<List<NotificacionResponse>> getNotificacionesNoLeidasByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(notificacionService.findByUsuarioIdAndNoLeidas(idUsuario));
    }
    
    @PutMapping("/{id}/marcar-leida")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(notificacionService.marcarComoLeida(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createNotificacion(@Valid @RequestBody NotificacionRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(notificacionService.save(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotificacion(@PathVariable Long id, @Valid @RequestBody NotificacionRequest request) {
        try {
            return ResponseEntity.ok(notificacionService.update(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotificacion(@PathVariable Long id) {
        try {
            notificacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
