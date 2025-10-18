package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Responses.DocenteResponse;
import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.service.DocenteService;
import com.Geventos.GestionDeEventos.service.UsuarioService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocenteController {

    private final DocenteService docenteService;
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<DocenteResponse>> getAllDocentes() {
        List<Docente> docentes = docenteService.findAll();
        List<DocenteResponse> response = docentes.stream()
                .map(docente -> new DocenteResponse(usuarioService.findById(docente.getUsuario().getIdUsuario()).get().getNombre(), docente.getUnidadAcademica(), docente.getCargo()))
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocenteResponse> getDocenteById(@PathVariable Long id) {
        Optional<Docente> docente = docenteService.findById(id);
        return docente.map(d -> ResponseEntity.ok(new DocenteResponse(usuarioService.findById(d.getUsuario().getIdUsuario()).get().getNombre(), d.getUnidadAcademica(), d.getCargo())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<DocenteResponse> getDocenteByUsuarioId(@PathVariable Long idUsuario) {
        Optional<Docente> docente = docenteService.findByUsuarioId(idUsuario);
        return docente.map(d -> ResponseEntity.ok(new DocenteResponse(usuarioService.findById(d.getUsuario().getIdUsuario()).get().getNombre(), d.getUnidadAcademica(), d.getCargo())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/unidad-academica/{unidadAcademica}")
    public ResponseEntity<List<DocenteResponse>> getDocentesByUnidadAcademica(@PathVariable String unidadAcademica) {
        List<Docente> docentes = docenteService.findByUnidadAcademica(unidadAcademica);
        List<DocenteResponse> response = docentes.stream()
                .map(docente -> new DocenteResponse(usuarioService.findById(docente.getUsuario().getIdUsuario()).get().getNombre(), docente.getUnidadAcademica(), docente.getCargo()))
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cargo/{cargo}")
    public ResponseEntity<List<DocenteResponse>> getDocentesByCargo(@PathVariable String cargo) {
        List<Docente> docentes = docenteService.findByCargo(cargo);
        List<DocenteResponse> response = docentes.stream()
                .map(docente -> new DocenteResponse(usuarioService.findById(docente.getUsuario().getIdUsuario()).get().getNombre(), docente.getUnidadAcademica(), docente.getCargo()))
                .toList();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocenteResponse> updateDocente(@PathVariable Long id, @RequestBody Docente docente) {
        try {
            Docente updatedDocente = docenteService.update(id, docente);
            return ResponseEntity.ok(new DocenteResponse(usuarioService.findById(updatedDocente.getUsuario().getIdUsuario()).get().getNombre(), updatedDocente.getUnidadAcademica(), updatedDocente.getCargo()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocente(@PathVariable Long id) {
        try {
            docenteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
