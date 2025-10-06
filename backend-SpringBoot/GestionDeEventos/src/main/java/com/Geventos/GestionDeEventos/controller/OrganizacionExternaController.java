package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
import com.Geventos.GestionDeEventos.service.OrganizacionExternaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizaciones-externas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizacionExternaController {
    
    private final OrganizacionExternaService organizacionExternaService;
    
    @GetMapping
    public ResponseEntity<List<OrganizacionExterna>> getAllOrganizacionesExternas() {
        List<OrganizacionExterna> organizaciones = organizacionExternaService.findAll();
        return ResponseEntity.ok(organizaciones);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrganizacionExterna> getOrganizacionExternaById(@PathVariable Long id) {
        Optional<OrganizacionExterna> organizacion = organizacionExternaService.findById(id);
        return organizacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/sector-economico/{sectorEconomico}")
    public ResponseEntity<List<OrganizacionExterna>> getOrganizacionesBySectorEconomico(@PathVariable String sectorEconomico) {
        List<OrganizacionExterna> organizaciones = organizacionExternaService.findBySectorEconomico(sectorEconomico);
        return ResponseEntity.ok(organizaciones);
    }
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<OrganizacionExterna>> getOrganizacionesByNombre(@PathVariable String nombre) {
        List<OrganizacionExterna> organizaciones = organizacionExternaService.findByNombreContaining(nombre);
        return ResponseEntity.ok(organizaciones);
    }
    
    @GetMapping("/representante/{representante}")
    public ResponseEntity<List<OrganizacionExterna>> getOrganizacionesByRepresentante(@PathVariable String representante) {
        List<OrganizacionExterna> organizaciones = organizacionExternaService.findByRepresentanteLegalContaining(representante);
        return ResponseEntity.ok(organizaciones);
    }
    
    @GetMapping("/ubicacion/{ubicacion}")
    public ResponseEntity<List<OrganizacionExterna>> getOrganizacionesByUbicacion(@PathVariable String ubicacion) {
        List<OrganizacionExterna> organizaciones = organizacionExternaService.findByUbicacionContaining(ubicacion);
        return ResponseEntity.ok(organizaciones);
    }

    @GetMapping("/nit/{nit}")
    public ResponseEntity<OrganizacionExterna> getOrganizacionByNit(@PathVariable String nit) {
        Optional<OrganizacionExterna> organizacion = organizacionExternaService.findByNit(nit);
        return organizacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<OrganizacionExterna> createOrganizacionExterna(@RequestBody OrganizacionExterna organizacionExterna) {
        try {
            OrganizacionExterna savedOrganizacion = organizacionExternaService.save(organizacionExterna);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrganizacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrganizacionExterna> updateOrganizacionExterna(@PathVariable Long id, @RequestBody OrganizacionExterna organizacionExterna) {
        try {
            OrganizacionExterna updatedOrganizacion = organizacionExternaService.update(id, organizacionExterna);
            return ResponseEntity.ok(updatedOrganizacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganizacionExterna(@PathVariable Long id) {
        try {
            organizacionExternaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
