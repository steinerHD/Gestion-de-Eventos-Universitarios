package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.InstalacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.InstalacionResponse;
import com.Geventos.GestionDeEventos.service.InstalacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/instalaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InstalacionController {

    private final InstalacionService instalacionService;

    @GetMapping
    public ResponseEntity<List<InstalacionResponse>> getAllInstalaciones() {
        return ResponseEntity.ok(instalacionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstalacionResponse> getInstalacionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(instalacionService.findById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<InstalacionResponse>> getInstalacionesByTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(instalacionService.findByTipo(tipo));
    }

    @GetMapping("/capacidad/{capacidad}")
    public ResponseEntity<List<InstalacionResponse>> getInstalacionesByCapacidad(@PathVariable Integer capacidad) {
        return ResponseEntity.ok(instalacionService.findByCapacidadGreaterThanEqual(capacidad));
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<InstalacionResponse>> getInstalacionesByNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(instalacionService.findByNombreContaining(nombre));
    }

    @GetMapping("/ubicacion/{ubicacion}")
    public ResponseEntity<List<InstalacionResponse>> getInstalacionesByUbicacion(@PathVariable String ubicacion) {
        return ResponseEntity.ok(instalacionService.findByUbicacionContaining(ubicacion));
    }

    @PostMapping
    public ResponseEntity<?> createInstalacion(@Valid @RequestBody InstalacionRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(instalacionService.save(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInstalacion(@PathVariable Long id, @Valid @RequestBody InstalacionRequest request) {
        try {
            return ResponseEntity.ok(instalacionService.update(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInstalacion(@PathVariable Long id) {
        try {
            instalacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
