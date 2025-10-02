package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.dto.DocenteRequest;
import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import com.Geventos.GestionDeEventos.service.DocenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Docente>> getAllDocentes() {
        List<Docente> docentes = docenteService.findAll();
        return ResponseEntity.ok(docentes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Docente> getDocenteById(@PathVariable Long id) {
        Optional<Docente> docente = docenteService.findById(id);
        return docente.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Docente> getDocenteByUsuarioId(@PathVariable Long idUsuario) {
        Optional<Docente> docente = docenteService.findByUsuarioId(idUsuario);
        return docente.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/unidad-academica/{unidadAcademica}")
    public ResponseEntity<List<Docente>> getDocentesByUnidadAcademica(@PathVariable String unidadAcademica) {
        List<Docente> docentes = docenteService.findByUnidadAcademica(unidadAcademica);
        return ResponseEntity.ok(docentes);
    }

    @GetMapping("/cargo/{cargo}")
    public ResponseEntity<List<Docente>> getDocentesByCargo(@PathVariable String cargo) {
        List<Docente> docentes = docenteService.findByCargo(cargo);
        return ResponseEntity.ok(docentes);
    }

    // ---------- POST con DTO y path idUsuario ----------
    @PostMapping("/evaluar/{idUsuario}")
    public ResponseEntity<Docente> createDocente(@PathVariable Long idUsuario,
            @RequestBody DocenteRequest request) {
        try {
            // Buscar usuario existente
            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

            // Crear docente y asignar relación
            Docente docente = new Docente();
            docente.setUsuario(usuario); // MapsId va a copiar el id de usuario
            docente.setUnidadAcademica(request.getUnidadAcademica());
            docente.setCargo(request.getCargo());

            // Guardar docente: el service ya recibe el idUsuario
            Docente savedDocente = docenteService.save(idUsuario, docente);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedDocente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Docente> updateDocente(@PathVariable Long id, @RequestBody Docente docente) {
        try {
            Docente updatedDocente = docenteService.update(id, docente);
            return ResponseEntity.ok(updatedDocente);
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
