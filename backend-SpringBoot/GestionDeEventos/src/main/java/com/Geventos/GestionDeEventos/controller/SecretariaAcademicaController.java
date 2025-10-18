package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Responses.SecretariaAcademicaResponse;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.service.SecretariaAcademicaService;
import com.Geventos.GestionDeEventos.service.UsuarioService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secretarias-academicas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SecretariaAcademicaController {
    
    private final SecretariaAcademicaService secretariaAcademicaService;
    private final UsuarioService usuarioService;
    
    @GetMapping
    public ResponseEntity<List<SecretariaAcademicaResponse>> getAllSecretariasAcademicas() {
        List<SecretariaAcademica> secretarias = secretariaAcademicaService.findAll();
        List<SecretariaAcademicaResponse> responses = secretarias.stream()
                .map(secretaria -> new SecretariaAcademicaResponse(usuarioService.findById(secretaria.getUsuario().getIdUsuario()).get().getNombre(), secretaria.getFacultad()))
                .toList();
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SecretariaAcademicaResponse> getSecretariaAcademicaById(@PathVariable Long id) {
        Optional<SecretariaAcademica> secretaria = secretariaAcademicaService.findById(id);
        return secretaria.map(est -> new SecretariaAcademicaResponse(usuarioService.findById(est.getUsuario().getIdUsuario()).get().getNombre(), est.getFacultad()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<SecretariaAcademicaResponse> getSecretariaAcademicaByUsuarioId(@PathVariable Long idUsuario) {
        Optional<SecretariaAcademica> secretaria = secretariaAcademicaService.findByUsuarioId(idUsuario);
        return secretaria.map(est -> new SecretariaAcademicaResponse(usuarioService.findById(est.getUsuario().getIdUsuario()).get().getNombre(), est.getFacultad()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/facultad/{facultad}")
    public ResponseEntity<List<SecretariaAcademicaResponse>> getSecretariasAcademicasByFacultad(@PathVariable String facultad) {
        List<SecretariaAcademica> secretarias = secretariaAcademicaService.findByFacultad(facultad);
        List<SecretariaAcademicaResponse> responses = secretarias.stream()
                .map(secretaria -> new SecretariaAcademicaResponse(usuarioService.findById(secretaria.getUsuario().getIdUsuario()).get().getNombre(), secretaria.getFacultad()))
                .toList();
        return ResponseEntity.ok(responses);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SecretariaAcademicaResponse> updateSecretariaAcademica(@PathVariable Long id, @RequestBody SecretariaAcademica secretariaAcademica) {
        try {
            SecretariaAcademica updatedSecretaria = secretariaAcademicaService.update(id, secretariaAcademica);
            return ResponseEntity.ok(new SecretariaAcademicaResponse(usuarioService.findById(updatedSecretaria.getUsuario().getIdUsuario()).get().getNombre(), updatedSecretaria.getFacultad()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecretariaAcademica(@PathVariable Long id) {
        try {
            secretariaAcademicaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
