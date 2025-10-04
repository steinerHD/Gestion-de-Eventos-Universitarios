package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.service.SecretariaAcademicaService;
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
    
    @GetMapping
    public ResponseEntity<List<SecretariaAcademica>> getAllSecretariasAcademicas() {
        List<SecretariaAcademica> secretarias = secretariaAcademicaService.findAll();
        return ResponseEntity.ok(secretarias);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SecretariaAcademica> getSecretariaAcademicaById(@PathVariable Long id) {
        Optional<SecretariaAcademica> secretaria = secretariaAcademicaService.findById(id);
        return secretaria.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<SecretariaAcademica> getSecretariaAcademicaByUsuarioId(@PathVariable Long idUsuario) {
        Optional<SecretariaAcademica> secretaria = secretariaAcademicaService.findByUsuarioId(idUsuario);
        return secretaria.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/facultad/{facultad}")
    public ResponseEntity<List<SecretariaAcademica>> getSecretariasAcademicasByFacultad(@PathVariable String facultad) {
        List<SecretariaAcademica> secretarias = secretariaAcademicaService.findByFacultad(facultad);
        return ResponseEntity.ok(secretarias);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SecretariaAcademica> updateSecretariaAcademica(@PathVariable Long id, @RequestBody SecretariaAcademica secretariaAcademica) {
        try {
            SecretariaAcademica updatedSecretaria = secretariaAcademicaService.update(id, secretariaAcademica);
            return ResponseEntity.ok(updatedSecretaria);
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
