package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.EstudianteRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EstudianteResponse;
import com.Geventos.GestionDeEventos.service.EstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estudiantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EstudianteController {

    private final EstudianteService estudianteService;

    @GetMapping
    public ResponseEntity<List<EstudianteResponse>> getAllEstudiantes() {
        return ResponseEntity.ok(estudianteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteResponse> getEstudianteById(@PathVariable Long id) {
        Optional<EstudianteResponse> estudiante = estudianteService.findById(id);
        return estudiante.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigoEstudiantil}")
    public ResponseEntity<EstudianteResponse> getByCodigo(@PathVariable String codigoEstudiantil) {
        Optional<EstudianteResponse> estudiante = estudianteService.findByCodigoEstudiantil(codigoEstudiantil);
        return estudiante.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<EstudianteResponse> getByUsuarioId(@PathVariable Long idUsuario) {
        Optional<EstudianteResponse> estudiante = estudianteService.findByUsuarioId(idUsuario);
        return estudiante.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudianteResponse> updateEstudiante(@PathVariable Long id, @RequestBody EstudianteRequest request) {
        try {
            EstudianteResponse updated = estudianteService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstudiante(@PathVariable Long id) {
        try {
            estudianteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/exists/codigo/{codigoEstudiantil}")
    public ResponseEntity<Boolean> existsByCodigo(@PathVariable String codigoEstudiantil) {
        return ResponseEntity.ok(estudianteService.existsByCodigoEstudiantil(codigoEstudiantil));
    }
}
