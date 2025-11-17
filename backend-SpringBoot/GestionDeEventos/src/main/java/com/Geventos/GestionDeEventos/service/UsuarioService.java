package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.UsuarioRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.UsuarioResponse;
import com.Geventos.GestionDeEventos.DTOs.Requests.PerfilUpdateRequest;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.entity.Estudiante;
import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.mappers.UsuarioMapper;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import com.Geventos.GestionDeEventos.repository.EstudianteRepository;
import com.Geventos.GestionDeEventos.repository.DocenteRepository;
import com.Geventos.GestionDeEventos.repository.SecretariaAcademicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final SecretariaAcademicaRepository secretariaAcademicaRepository;
    private final PasswordService passwordService;

    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<Usuario> findEntityById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<UsuarioResponse> findById(Long id) {
        return usuarioRepository.findById(id).map(usuarioMapper::toResponse);
    }

    public Optional<UsuarioResponse> findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo).map(usuarioMapper::toResponse);
    }

    public UsuarioResponse save(UsuarioRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        Usuario usuario = usuarioMapper.toEntity(request);
        
        // Encriptar la contraseña antes de guardar
        if (request.getContrasenaHash() != null && !request.getContrasenaHash().isEmpty()) {
            String encryptedPassword = passwordService.encryptPassword(request.getContrasenaHash());
            usuario.setContrasenaHash(encryptedPassword);
        }
        
        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    public UsuarioResponse update(Long id, UsuarioRequest request) {
        Usuario existingUsuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (request.getCorreo() != null && !existingUsuario.getCorreo().equals(request.getCorreo()) &&
                usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado por otro usuario");
        }

        if (request.getNombre() != null) existingUsuario.setNombre(request.getNombre());
        if (request.getCorreo() != null) existingUsuario.setCorreo(request.getCorreo());
        
        // Encriptar la contraseña si se está actualizando
        if (request.getContrasenaHash() != null && !request.getContrasenaHash().isEmpty()) {
            String encryptedPassword = passwordService.encryptPassword(request.getContrasenaHash());
            existingUsuario.setContrasenaHash(encryptedPassword);
        }

        return usuarioMapper.toResponse(usuarioRepository.save(existingUsuario));
    }

    public UsuarioResponse updatePerfil(Long id, PerfilUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }

        Estudiante estudiante = usuario.getEstudiante();
        if (estudiante != null) {
            if (request.getPrograma() != null) {
                estudiante.setPrograma(request.getPrograma());
            }
            estudianteRepository.save(estudiante);
        }

        Docente docente = usuario.getDocente();
        if (docente != null) {
            if (request.getUnidadAcademica() != null) {
                docente.setUnidadAcademica(request.getUnidadAcademica());
            }
            if (request.getCargo() != null) {
                docente.setCargo(request.getCargo());
            }
            docenteRepository.save(docente);
        }

        SecretariaAcademica secretaria = usuario.getSecretariaAcademica();
        if (secretaria != null) {
            if (request.getFacultad() != null) {
                secretaria.setFacultad(request.getFacultad());
            }
            secretariaAcademicaRepository.save(secretaria);
        }

        Usuario saved = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(saved);
    }

    public void deleteById(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    public boolean existsByCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    public Optional<UsuarioResponse> authenticate(String correo, String rawPassword) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        
        if (usuarioOpt.isEmpty()) {
            return Optional.empty();
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Verificar la contraseña usando BCrypt
        if (passwordService.verifyPassword(rawPassword, usuario.getContrasenaHash())) {
            return Optional.of(usuarioMapper.toResponse(usuario));
        }
        
        return Optional.empty();
    }
    
    /**
     * Actualiza la contraseña de un usuario (para recuperación de contraseña)
     */
    public void updatePassword(Long userId, String newRawPassword) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        String encryptedPassword = passwordService.encryptPassword(newRawPassword);
        usuario.setContrasenaHash(encryptedPassword);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Actualiza la contraseña verificando la contraseña anterior
     */
    public boolean changePassword(Long userId, String oldRawPassword, String newRawPassword) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        // Verificar que la contraseña anterior sea correcta
        if (!passwordService.verifyPassword(oldRawPassword, usuario.getContrasenaHash())) {
            return false;
        }
        
        // Actualizar a la nueva contraseña
        String encryptedPassword = passwordService.encryptPassword(newRawPassword);
        usuario.setContrasenaHash(encryptedPassword);
        usuarioRepository.save(usuario);
        return true;
    }
}
