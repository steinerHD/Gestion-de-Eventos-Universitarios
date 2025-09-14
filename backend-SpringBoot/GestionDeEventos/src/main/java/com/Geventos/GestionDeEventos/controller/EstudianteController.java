package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.Estudiante;
import com.Geventos.GestionDeEventos.service.EstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<List<Estudiante>> getAllEstudiantes() {
        List<Estudiante> estudiantes = estudianteService.findAll();
        return ResponseEntity.ok(estudiantes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> getEstudianteById(@PathVariable Long id) {
        Optional<Estudiante> estudiante = estudianteService.findById(id);
        return estudiante.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/codigo/{codigoEstudiantil}")
    public ResponseEntity<Estudiante> getEstudianteByCodigo(@PathVariable String codigoEstudiantil) {
        Optional<Estudiante> estudiante = estudianteService.findByCodigoEstudiantil(codigoEstudiantil);
        return estudiante.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Estudiante> getEstudianteByUsuarioId(@PathVariable Long idUsuario) {
        Optional<Estudiante> estudiante = estudianteService.findByUsuarioId(idUsuario);
        return estudiante.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Estudiante> createEstudiante(@RequestBody Estudiante estudiante) {
        try {
            Estudiante savedEstudiante = estudianteService.save(estudiante);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEstudiante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> updateEstudiante(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        try {
            Estudiante updatedEstudiante = estudianteService.update(id, estudiante);
            return ResponseEntity.ok(updatedEstudiante);
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
    public ResponseEntity<Boolean> existsByCodigoEstudiantil(@PathVariable String codigoEstudiantil) {
        boolean exists = estudianteService.existsByCodigoEstudiantil(codigoEstudiantil);
        return ResponseEntity.ok(exists);
    }
}
