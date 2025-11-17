package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.EvaluacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EvaluacionResponse;
import com.Geventos.GestionDeEventos.entity.Evaluacion;
import com.Geventos.GestionDeEventos.service.EvaluacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    @GetMapping
    public ResponseEntity<List<EvaluacionResponse>> getAllEvaluaciones() {
        return ResponseEntity.ok(evaluacionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluacionResponse> getEvaluacionById(@PathVariable Long id) {
        return evaluacionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<EvaluacionResponse>> getEvaluacionesByEstado(@PathVariable Evaluacion.EstadoEvaluacion estado) {
        return ResponseEntity.ok(evaluacionService.findByEstado(estado));
    }

    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<EvaluacionResponse>> getEvaluacionesByEvento(@PathVariable Long idEvento) {
        return ResponseEntity.ok(evaluacionService.findByEventoId(idEvento));
    }

    @GetMapping("/secretaria/{idSecretaria}")
    public ResponseEntity<List<EvaluacionResponse>> getEvaluacionesBySecretaria(@PathVariable Long idSecretaria) {
        return ResponseEntity.ok(evaluacionService.findBySecretariaId(idSecretaria));
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<EvaluacionResponse>> getEvaluacionesByFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(evaluacionService.findByFecha(fecha));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<EvaluacionResponse>> getEvaluacionesByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(evaluacionService.findByFechaBetween(fechaInicio, fechaFin));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<EvaluacionResponse>> getEvaluacionesPendientes() {
        return ResponseEntity.ok(evaluacionService.findEvaluacionesPendientes());
    }

    @PostMapping
    public ResponseEntity<EvaluacionResponse> createEvaluacion(@RequestBody EvaluacionRequest request) {
        try {
            EvaluacionResponse response = evaluacionService.save(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            System.err.println("Error al crear evaluación: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Error inesperado al crear evaluación: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluacionResponse> updateEvaluacion(
            @PathVariable Long id, @RequestBody EvaluacionRequest request) {
        try {
            EvaluacionResponse response = evaluacionService.update(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluacion(@PathVariable Long id) {
        try {
            evaluacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
