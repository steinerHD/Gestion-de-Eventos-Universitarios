package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.mappers.SecretariaMapper;
import com.Geventos.GestionDeEventos.mappers.UsuarioMapper;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import com.Geventos.GestionDeEventos.service.JwtService;
import com.Geventos.GestionDeEventos.service.RecuperarContrasenaService;
import com.Geventos.GestionDeEventos.service.UsuarioService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.Geventos.GestionDeEventos.service.EstudianteService;
import com.Geventos.GestionDeEventos.DTOs.Requests.AuthRequest;
import com.Geventos.GestionDeEventos.DTOs.Requests.DocenteRequest;
import com.Geventos.GestionDeEventos.DTOs.Requests.EstudianteRequest;
import com.Geventos.GestionDeEventos.DTOs.Requests.SecretariaRequest;
import com.Geventos.GestionDeEventos.DTOs.Requests.UsuarioRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.DocenteResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.EstudianteResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.JwtResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.SecretariaResponse;
import com.Geventos.GestionDeEventos.DTOs.Responses.UsuarioResponse;
import com.Geventos.GestionDeEventos.service.CorreoBienvenidaService;
import com.Geventos.GestionDeEventos.service.DocenteService;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.service.SecretariaAcademicaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    private final EstudianteService estudianteService;
    private final DocenteService docenteService;
    private final SecretariaAcademicaService secretariaAcademicaService;
    @Autowired
    private RecuperarContrasenaService recuperarContrasenaService;
    private final UsuarioMapper usuarioMapper;
    private final CorreoBienvenidaService correoBienvenidaService;

    @PostMapping("/recuperar")
    public ResponseEntity<Map<String, String>> recuperarContrasena(@RequestBody Map<String, String> body) {
        String correo = body.get("correo");
        System.out.println("Correo recibido: " + correo);

        String resultado = recuperarContrasenaService.enviarContrasena(correo);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", resultado);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElse(null);

        if (usuario == null || !usuario.getContrasenaHash().equals(request.getContrasenaHash())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        String token = jwtService.generateToken(usuario.getCorreo());
        return ResponseEntity.ok(new JwtResponse(token));
    }

    // Registro de secretaria académica
    @PostMapping("/registrar/secretaria")
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

    // Registro de docente
    @PostMapping("/registrar/docente")
    public ResponseEntity<?> createDocente(@Valid @RequestBody DocenteRequest request) {
        try {
            DocenteResponse response = docenteService.save(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar el docente");
        }
    }

    // Registro de estudiante
    @PostMapping("/registrar/estudiante")
    public ResponseEntity<?> createEstudiante(@RequestBody EstudianteRequest request) {
        try {
            EstudianteResponse response = estudianteService.save(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar el estudiante");
        }
    }

    // Registro de usuario
    @PostMapping("/registrar/usuario")
    public ResponseEntity<UsuarioResponse> createUsuario(@RequestBody UsuarioRequest request) {
        try {
            UsuarioResponse response = usuarioService.save(request);

            // Obtener la entidad del usuario para enviar el correo
            Usuario usuario = usuarioMapper.toEntity(request);
            usuario.setCorreo(response.getCorreo());
            usuario.setNombre(response.getNombre());

            // Enviar correo de bienvenida
            correoBienvenidaService.enviarCorreoBienvenida(usuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}