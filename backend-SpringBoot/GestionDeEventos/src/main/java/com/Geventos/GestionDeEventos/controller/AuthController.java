package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.mappers.DocenteMapper;
import com.Geventos.GestionDeEventos.mappers.EstudianteMapper;
import com.Geventos.GestionDeEventos.mappers.SecretariaMapper;
import com.Geventos.GestionDeEventos.mappers.UsuarioMapper;
import com.Geventos.GestionDeEventos.service.JwtService;
import com.Geventos.GestionDeEventos.service.RecuperarContrasenaService;
import com.Geventos.GestionDeEventos.service.UsuarioService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.entity.Estudiante;
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
        System.out.println("Solicitud de recuperación de contraseña para: " + correo);

        String resultado = recuperarContrasenaService.enviarTokenRecuperacion(correo);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", resultado);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/restablecer-contrasena")
    public ResponseEntity<Map<String, String>> restablecerContrasena(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String nuevaContrasena = body.get("nuevaContrasena");

        if (token == null || nuevaContrasena == null || nuevaContrasena.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Token y nueva contraseña son requeridos");
            return ResponseEntity.badRequest().body(response);
        }

        boolean exitoso = recuperarContrasenaService.restablecerContrasena(token, nuevaContrasena);

        Map<String, String> response = new HashMap<>();
        if (exitoso) {
            response.put("mensaje", "Contraseña restablecida correctamente");
            return ResponseEntity.ok(response);
        } else {
            response.put("mensaje", "Token inválido, expirado o ya utilizado");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validar-token")
    public ResponseEntity<Map<String, Boolean>> validarToken(@RequestParam String token) {
        boolean valido = recuperarContrasenaService.validarToken(token);

        Map<String, Boolean> response = new HashMap<>();
        response.put("valido", valido);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Usar el método authenticate del UsuarioService que verifica con BCrypt
        Optional<UsuarioResponse> usuarioOpt = usuarioService.authenticate(request.getCorreo(), request.getContrasenaHash());
        
        if (usuarioOpt.isPresent()) {
            String token = jwtService.generateToken(usuarioOpt.get().getCorreo());
            return ResponseEntity.ok(new JwtResponse(token));
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
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
            Docente docente = docenteService.save(request);
            DocenteResponse response = DocenteMapper.toResponse(docente);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Registro de estudiante
    @PostMapping("/registrar/estudiante")
    public ResponseEntity<?> createEstudiante(@Valid @RequestBody EstudianteRequest request) {
        try {
            Estudiante estudiante = estudianteService.save(request);
            EstudianteResponse response = EstudianteMapper.toResponse(estudiante);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
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