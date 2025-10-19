package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.DocenteRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.DocenteResponse;
import com.Geventos.GestionDeEventos.service.DocenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocenteController {

    private final DocenteService docenteService;

    // Obtener todos los docentes
    @GetMapping
    public ResponseEntity<List<DocenteResponse>> getAllDocentes() {
        return ResponseEntity.ok(docenteService.findAll());
    }

    // Obtener docente por ID
    @GetMapping("/{id}")
    public ResponseEntity<DocenteResponse> getDocenteById(@PathVariable Long id) {
        return docenteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener docente por ID de usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<DocenteResponse> getDocenteByUsuarioId(@PathVariable Long idUsuario) {
        return docenteService.findByUsuarioId(idUsuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener docentes por unidad académica
    @GetMapping("/unidad-academica/{unidadAcademica}")
    public ResponseEntity<List<DocenteResponse>> getDocentesByUnidadAcademica(@PathVariable String unidadAcademica) {
        return ResponseEntity.ok(docenteService.findByUnidadAcademica(unidadAcademica));
    }

    // Obtener docentes por cargo
    @GetMapping("/cargo/{cargo}")
    public ResponseEntity<List<DocenteResponse>> getDocentesByCargo(@PathVariable String cargo) {
        return ResponseEntity.ok(docenteService.findByCargo(cargo));
    }

    // Actualizar docente existente (usa DTO)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocente(@PathVariable Long id, @Valid @RequestBody DocenteRequest request) {
        try {
            DocenteResponse updated = docenteService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            // Bad request si datos inválidos o entidad no encontrada
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Eliminar docente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocente(@PathVariable Long id) {
        try {
            docenteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
