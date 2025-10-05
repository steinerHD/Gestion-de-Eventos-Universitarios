package com.Geventos.GestionDeEventos.controller;

import com.Geventos.GestionDeEventos.dto.LoginRequest;
import com.Geventos.GestionDeEventos.dto.JwtResponse;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import com.Geventos.GestionDeEventos.service.JwtService;
import com.Geventos.GestionDeEventos.service.RecuperarContrasenaService;
import com.Geventos.GestionDeEventos.service.UsuarioService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.Geventos.GestionDeEventos.dto.EstudianteRequest;
import com.Geventos.GestionDeEventos.entity.Estudiante;
import com.Geventos.GestionDeEventos.service.EstudianteService;
import com.Geventos.GestionDeEventos.dto.DocenteRequest;
import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.service.DocenteService;
import com.Geventos.GestionDeEventos.dto.SecretariaAcademicaRequest;
import com.Geventos.GestionDeEventos.dto.UserRequest;
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

    @PostMapping("/recuperar")
    public String recuperarContrasena(@RequestBody Map<String, String> body) {
        String correo = body.get("correo");
        System.out.println("Correo recibido: " + correo);
        return recuperarContrasenaService.enviarContrasena(correo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
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
    public ResponseEntity<?> registrarSecretaria(@RequestBody SecretariaAcademicaRequest request) {
        System.out.println("[DEBUG] Entrando a /api/auth/registrar/secretaria");
        try {
            SecretariaAcademica saved = secretariaAcademicaService.save(request.getIdUsuario(), request.getFacultad());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Registro de docente
    @PostMapping("/registrar/docente")
    public ResponseEntity<?> registrarDocente(@RequestBody DocenteRequest request) {
        try {
            Docente docente = new Docente();
            docente.setUnidadAcademica(request.getUnidadAcademica());
            docente.setCargo(request.getCargo());
            Docente saved = docenteService.save(request.getIdUsuario(), docente);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Registro de estudiante
    @PostMapping("/registrar/estudiante")
    public ResponseEntity<?> registrarEstudiante(@RequestBody EstudianteRequest request) {
        try {
            Estudiante estudiante = new Estudiante();
            estudiante.setCodigoEstudiantil(request.getCodigoEstudiantil());
            estudiante.setPrograma(request.getPrograma());
            Estudiante saved = estudianteService.save(request.getIdUsuario(), estudiante);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Registro de usuario
    @PostMapping("/registrar/usuario")
    public ResponseEntity<?> registrarUsuario(@RequestBody UserRequest request) {
        System.out.println("[DEBUG] Entrando a /api/auth/registrar/usuario");
        try {
            Usuario usuario = new Usuario();
            usuario.setNombre(request.getNombre());
            usuario.setCorreo(request.getCorreo());
            usuario.setContrasenaHash(request.getContrasenaHash());
            Usuario saved = usuarioService.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}