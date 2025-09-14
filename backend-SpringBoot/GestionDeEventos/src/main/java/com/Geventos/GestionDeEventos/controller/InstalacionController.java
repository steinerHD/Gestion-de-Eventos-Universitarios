package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.Instalacion;
import com.Geventos.GestionDeEventos.service.InstalacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/instalaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InstalacionController {
    
    private final InstalacionService instalacionService;
    
    @GetMapping
    public ResponseEntity<List<Instalacion>> getAllInstalaciones() {
        List<Instalacion> instalaciones = instalacionService.findAll();
        return ResponseEntity.ok(instalaciones);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Instalacion> getInstalacionById(@PathVariable Long id) {
        Optional<Instalacion> instalacion = instalacionService.findById(id);
        return instalacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Instalacion>> getInstalacionesByTipo(@PathVariable String tipo) {
        List<Instalacion> instalaciones = instalacionService.findByTipo(tipo);
        return ResponseEntity.ok(instalaciones);
    }
    
    @GetMapping("/capacidad/{capacidad}")
    public ResponseEntity<List<Instalacion>> getInstalacionesByCapacidadMinima(@PathVariable Integer capacidad) {
        List<Instalacion> instalaciones = instalacionService.findByCapacidadGreaterThanEqual(capacidad);
        return ResponseEntity.ok(instalaciones);
    }
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<Instalacion>> getInstalacionesByNombre(@PathVariable String nombre) {
        List<Instalacion> instalaciones = instalacionService.findByNombreContaining(nombre);
        return ResponseEntity.ok(instalaciones);
    }
    
    @GetMapping("/ubicacion/{ubicacion}")
    public ResponseEntity<List<Instalacion>> getInstalacionesByUbicacion(@PathVariable String ubicacion) {
        List<Instalacion> instalaciones = instalacionService.findByUbicacionContaining(ubicacion);
        return ResponseEntity.ok(instalaciones);
    }
    
    @PostMapping
    public ResponseEntity<Instalacion> createInstalacion(@RequestBody Instalacion instalacion) {
        try {
            Instalacion savedInstalacion = instalacionService.save(instalacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedInstalacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Instalacion> updateInstalacion(@PathVariable Long id, @RequestBody Instalacion instalacion) {
        try {
            Instalacion updatedInstalacion = instalacionService.update(id, instalacion);
            return ResponseEntity.ok(updatedInstalacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstalacion(@PathVariable Long id) {
        try {
            instalacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
