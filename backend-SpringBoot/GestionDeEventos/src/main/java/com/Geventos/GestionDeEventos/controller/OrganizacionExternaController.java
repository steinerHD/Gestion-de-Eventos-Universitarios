package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.OrganizacionExternaRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.OrganizacionExternaResponse;
import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
import com.Geventos.GestionDeEventos.mappers.OrganizacionExternaMapper;
import com.Geventos.GestionDeEventos.service.OrganizacionExternaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizaciones-externas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizacionExternaController {

    private final OrganizacionExternaService organizacionExternaService;

    @GetMapping
    public ResponseEntity<List<OrganizacionExternaResponse>> getAllOrganizacionesExternas() {
        List<OrganizacionExterna> organizaciones = organizacionExternaService.findAll();
        List<OrganizacionExternaResponse> responses = organizaciones.stream()
                .map(OrganizacionExternaMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizacionExternaResponse> getOrganizacionExternaById(@PathVariable Long id) {
        Optional<OrganizacionExterna> organizacion = organizacionExternaService.findById(id);
        return organizacion.map(o -> ResponseEntity.ok(OrganizacionExternaMapper.toResponse(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nit/{nit}")
    public ResponseEntity<OrganizacionExternaResponse> getOrganizacionByNit(@PathVariable String nit) {
        Optional<OrganizacionExterna> organizacion = organizacionExternaService.findByNit(nit);
        return organizacion.map(o -> ResponseEntity.ok(OrganizacionExternaMapper.toResponse(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sector-economico/{sectorEconomico}")
    public ResponseEntity<List<OrganizacionExternaResponse>> getBySectorEconomico(@PathVariable String sectorEconomico) {
        List<OrganizacionExterna> list = organizacionExternaService.findBySectorEconomico(sectorEconomico);
        List<OrganizacionExternaResponse> responses = list.stream()
                .map(OrganizacionExternaMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<OrganizacionExternaResponse> createOrganizacionExterna(
            @Valid @RequestBody OrganizacionExternaRequest request) {
        try {
            OrganizacionExterna saved = organizacionExternaService.save(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(OrganizacionExternaMapper.toResponse(saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrganizacionExternaResponse> updateOrganizacionExterna(
            @PathVariable Long id,
            @Valid @RequestBody OrganizacionExternaRequest request) {
        try {
            OrganizacionExterna updated = organizacionExternaService.update(id, request);
            return ResponseEntity.ok(OrganizacionExternaMapper.toResponse(updated));
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
