package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.Evaluacion;
import com.Geventos.GestionDeEventos.service.EvaluacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/evaluaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EvaluacionController {
    
    private final EvaluacionService evaluacionService;
    
    @GetMapping
    public ResponseEntity<List<Evaluacion>> getAllEvaluaciones() {
        List<Evaluacion> evaluaciones = evaluacionService.findAll();
        return ResponseEntity.ok(evaluaciones);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Evaluacion> getEvaluacionById(@PathVariable Long id) {
        Optional<Evaluacion> evaluacion = evaluacionService.findById(id);
        return evaluacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Evaluacion>> getEvaluacionesByEstado(@PathVariable Evaluacion.EstadoEvaluacion estado) {
        List<Evaluacion> evaluaciones = evaluacionService.findByEstado(estado);
        return ResponseEntity.ok(evaluaciones);
    }
    
    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<Evaluacion>> getEvaluacionesByEvento(@PathVariable Long idEvento) {
        List<Evaluacion> evaluaciones = evaluacionService.findByEventoId(idEvento);
        return ResponseEntity.ok(evaluaciones);
    }
    
    @GetMapping("/secretaria/{idSecretaria}")
    public ResponseEntity<List<Evaluacion>> getEvaluacionesBySecretaria(@PathVariable Long idSecretaria) {
        List<Evaluacion> evaluaciones = evaluacionService.findBySecretariaId(idSecretaria);
        return ResponseEntity.ok(evaluaciones);
    }
    
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Evaluacion>> getEvaluacionesByFecha(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Evaluacion> evaluaciones = evaluacionService.findByFecha(fecha);
        return ResponseEntity.ok(evaluaciones);
    }
    
    @GetMapping("/fecha")
    public ResponseEntity<List<Evaluacion>> getEvaluacionesByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<Evaluacion> evaluaciones = evaluacionService.findByFechaBetween(fechaInicio, fechaFin);
        return ResponseEntity.ok(evaluaciones);
    }
    
    @GetMapping("/pendientes")
    public ResponseEntity<List<Evaluacion>> getEvaluacionesPendientes() {
        List<Evaluacion> evaluaciones = evaluacionService.findEvaluacionesPendientes();
        return ResponseEntity.ok(evaluaciones);
    }
    
    @PostMapping
    public ResponseEntity<Evaluacion> createEvaluacion(@RequestBody Evaluacion evaluacion) {
        try {
            Evaluacion savedEvaluacion = evaluacionService.save(evaluacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvaluacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Evaluacion> updateEvaluacion(@PathVariable Long id, @RequestBody Evaluacion evaluacion) {
        try {
            Evaluacion updatedEvaluacion = evaluacionService.update(id, evaluacion);
            return ResponseEntity.ok(updatedEvaluacion);
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
