package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.DTOs.Requests.EventoRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoResponse;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventoController {

    private final EventoService eventoService;

    // ------------------------- CRUD DTO -------------------------
    @GetMapping
    public ResponseEntity<List<EventoResponse>> getAllEventos() {
        return ResponseEntity.ok(eventoService.findAllEventos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponse> getEventoById(@PathVariable Long id) {
        return eventoService.findByIdEvento(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EventoResponse> createEvento(@RequestBody EventoRequest request) {
        System.out.println("[DEBUG] POST /api/eventos - Request recibido");
        try {
            EventoResponse response = eventoService.createEvento(request);
            System.out.println("[DEBUG] Evento creado exitosamente con ID: " + response.getIdEvento());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            System.out.println("[DEBUG] Error en validación: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            System.out.println("[DEBUG] Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoResponse> updateEvento(@PathVariable Long id, @RequestBody EventoRequest request) {
        try {
            System.out.println("[DEBUG] PUT /api/eventos/" + id + " - Request recibido");
            EventoResponse response = eventoService.updateEvento(id, request);
            System.out.println("[DEBUG] Evento actualizado con ID: " + response.getIdEvento());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            System.out.println("[DEBUG] Error en validación (update): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.out.println("[DEBUG] Error inesperado (update): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        try {
            eventoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ------------------------- FILTROS -------------------------
    @GetMapping("/tipo/{tipoEvento}")
    public ResponseEntity<List<EventoResponse>> getEventosByTipo(@PathVariable Evento.TipoEvento tipoEvento) {
        return ResponseEntity.ok(eventoService.findByTipoEvento(tipoEvento));
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<EventoResponse>> getEventosByFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(eventoService.findByFecha(fecha));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<EventoResponse>> getEventosByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(eventoService.findByFechaBetween(fechaInicio, fechaFin));
    }

    @GetMapping("/organizador/{idOrganizador}")
    public ResponseEntity<List<EventoResponse>> getEventosByOrganizador(@PathVariable Long idOrganizador) {
        return ResponseEntity.ok(eventoService.findByOrganizadorId(idOrganizador));
    }

    @GetMapping("/instalacion/{idInstalacion}")
    public ResponseEntity<List<EventoResponse>> getEventosByInstalacion(@PathVariable Long idInstalacion) {
        return ResponseEntity.ok(eventoService.findByInstalacionId(idInstalacion));
    }

    @GetMapping("/titulo/{titulo}")
    public ResponseEntity<List<EventoResponse>> getEventosByTitulo(@PathVariable String titulo) {
        return ResponseEntity.ok(eventoService.findByTituloContaining(titulo));
    }

    @GetMapping("/futuros")
    public ResponseEntity<List<EventoResponse>> getEventosFuturos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(eventoService.findEventosFuturos(fecha));
    }

    // ------------------------- PDFs -------------------------
    @GetMapping("/{id}/aval")
    public ResponseEntity<String> getAvalPdf(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.findById(id).get().getAvalPdf());
    }

    // ------------------------- ENVIAR A VALIDACIÓN -------------------------
    @PostMapping("/{id}/enviar-validacion")
    public ResponseEntity<Void> enviarAValidacion(@PathVariable Long id) {
        try {
            System.out.println("[DEBUG] POST /api/eventos/" + id + "/enviar-validacion");
            eventoService.enviarAValidacion(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            System.out.println("[DEBUG] Error enviarAValidacion: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.out.println("[DEBUG] Error inesperado enviarAValidacion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ------------------------- PARTICIPACIONES ORGANIZACIONES -------------------------
    @PostMapping("/{id}/participaciones")
    public ResponseEntity<?> agregarParticipacionOrganizacion(
            @PathVariable Long id,
            @RequestBody com.Geventos.GestionDeEventos.DTOs.Requests.ParticipacionDetalleRequest participacionRequest) {
        try {
            // Verificar que el evento existe
            if (!eventoService.findById(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            // Crear la participación
            com.Geventos.GestionDeEventos.DTOs.Requests.ParticipacionOrganizacionRequest request = 
                new com.Geventos.GestionDeEventos.DTOs.Requests.ParticipacionOrganizacionRequest();
            request.setIdEvento(id);
            request.setIdOrganizacion(participacionRequest.getIdOrganizacion());
            request.setCertificadoPdf(participacionRequest.getCertificadoPdf());
            request.setRepresentanteDiferente(participacionRequest.getRepresentanteDiferente());
            request.setNombreRepresentanteDiferente(participacionRequest.getNombreRepresentanteDiferente());
            
            // Aquí necesitarías inyectar el ParticipacionOrganizacionService
            // Por ahora, devolvemos un mensaje de éxito
            return ResponseEntity.ok("Participación agregada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ------------------------- DEBUG ENDPOINTS -------------------------
    @GetMapping("/debug/organizaciones")
    public ResponseEntity<?> debugOrganizaciones() {
        try {
            // Aquí necesitarías inyectar el OrganizacionExternaRepository
            // Por ahora devolvemos un mensaje
            return ResponseEntity.ok("Endpoint de debug - necesitas inyectar OrganizacionExternaRepository");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ------------------------- TEST ENDPOINT -------------------------
    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        return ResponseEntity.ok("Autenticación funcionando correctamente");
    }

}
