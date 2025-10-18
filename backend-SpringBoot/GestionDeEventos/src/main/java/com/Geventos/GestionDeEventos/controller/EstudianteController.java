package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Responses.EstudianteResponse;
import com.Geventos.GestionDeEventos.entity.Estudiante;
import com.Geventos.GestionDeEventos.service.EstudianteService;
import com.Geventos.GestionDeEventos.service.UsuarioService;

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
    private final UsuarioService usuarioService;
    

    @GetMapping
    public ResponseEntity<List<EstudianteResponse>> getAllEstudiantes() {
        List<Estudiante> estudiantes = estudianteService.findAll();
        List<EstudianteResponse> responses = estudiantes.stream()
                .map(estudiante -> new EstudianteResponse(usuarioService.findById(estudiante.getUsuario().getIdUsuario()).get().getNombre(),estudiante.getCodigoEstudiantil(), estudiante.getPrograma()))
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteResponse> getEstudianteById(@PathVariable Long id) {
        Optional<Estudiante> estudiante = estudianteService.findById(id);
        return estudiante.map(est -> new EstudianteResponse(usuarioService.findById(est.getUsuario().getIdUsuario()).get().getNombre(), est.getCodigoEstudiantil(), est.getPrograma()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigoEstudiantil}")
    public ResponseEntity<EstudianteResponse> getEstudianteByCodigo(@PathVariable String codigoEstudiantil) {
        Optional<Estudiante> estudiante = estudianteService.findByCodigoEstudiantil(codigoEstudiantil);
        return estudiante.map(est -> new EstudianteResponse(usuarioService.findById(est.getUsuario().getIdUsuario()).get().getNombre(), est.getCodigoEstudiantil(), est.getPrograma()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<EstudianteResponse> getEstudianteByUsuarioId(@PathVariable Long idUsuario) {
        Optional<Estudiante> estudiante = estudianteService.findByUsuarioId(idUsuario);
        return estudiante.map(est -> new EstudianteResponse(usuarioService.findById(est.getUsuario().getIdUsuario()).get().getNombre(), est.getCodigoEstudiantil(), est.getPrograma()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<EstudianteResponse> updateEstudiante(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        try {
            Estudiante updatedEstudiante = estudianteService.update(id, estudiante);
            EstudianteResponse response = new EstudianteResponse(usuarioService.findById(updatedEstudiante.getUsuario().getIdUsuario()).get().getNombre(), updatedEstudiante.getCodigoEstudiantil(), updatedEstudiante.getPrograma());
            return ResponseEntity.ok(response);
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
