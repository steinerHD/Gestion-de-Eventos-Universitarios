package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.SecretariaRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.SecretariaResponse;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.mappers.SecretariaMapper;
import com.Geventos.GestionDeEventos.service.SecretariaAcademicaService;
import com.Geventos.GestionDeEventos.service.UsuarioService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secretarias-academicas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SecretariaAcademicaController {

    private final SecretariaAcademicaService secretariaAcademicaService;
    private final UsuarioService usuarioService;

 
    @PostMapping
    public ResponseEntity<SecretariaResponse> createSecretariaAcademica(
            @Valid @RequestBody SecretariaRequest request) {
        try {
            SecretariaAcademica secretaria = secretariaAcademicaService.save(request);
            SecretariaResponse response = SecretariaMapper.toResponse(secretaria);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping
    public ResponseEntity<List<SecretariaResponse>> getAllSecretariasAcademicas() {
        List<SecretariaAcademica> secretarias = secretariaAcademicaService.findAll();
        List<SecretariaResponse> responses = secretarias.stream()
                .map(SecretariaMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SecretariaResponse> getSecretariaAcademicaById(@PathVariable Long id) {
        Optional<SecretariaAcademica> secretaria = secretariaAcademicaService.findById(id);
        return secretaria.map(s -> ResponseEntity.ok(SecretariaMapper.toResponse(s)))
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<SecretariaResponse> getSecretariaAcademicaByUsuarioId(@PathVariable Long idUsuario) {
        Optional<SecretariaAcademica> secretaria = secretariaAcademicaService.findByUsuarioId(idUsuario);
        return secretaria.map(s -> ResponseEntity.ok(SecretariaMapper.toResponse(s)))
                .orElse(ResponseEntity.notFound().build());
    }

   
    @GetMapping("/facultad/{facultad}")
    public ResponseEntity<List<SecretariaResponse>> getSecretariasAcademicasByFacultad(@PathVariable String facultad) {
        List<SecretariaAcademica> secretarias = secretariaAcademicaService.findByFacultad(facultad);
        List<SecretariaResponse> responses = secretarias.stream()
                .map(SecretariaMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<SecretariaResponse> updateSecretariaAcademica(
            @PathVariable Long id,
            @Valid @RequestBody SecretariaRequest request) {

        try {
            
            Optional<Usuario> usuarioOpt = usuarioService.findEntityById(request.getIdUsuario());
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Usuario usuario = usuarioOpt.get();

            
            SecretariaAcademica secretaria = SecretariaMapper.toEntity(request, usuario);
            SecretariaAcademica updated = secretariaAcademicaService.update(id, secretaria);

            return ResponseEntity.ok(SecretariaMapper.toResponse(updated));

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
