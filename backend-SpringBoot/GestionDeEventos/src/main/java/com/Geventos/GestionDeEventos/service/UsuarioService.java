package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.dto.UsuarioDTO;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    
    public List<UsuarioDTO> findAll() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }
    
    public Optional<Usuario> findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
    
    public Usuario save(Usuario usuario) {
        // Validar que el correo no exista
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        return usuarioRepository.save(usuario);
    }
    
    public Usuario update(Long id, Usuario usuario) {
        Usuario existingUsuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        // Validar que el correo no esté en uso por otro usuario
        if (!existingUsuario.getCorreo().equals(usuario.getCorreo()) && 
            usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado por otro usuario");
        }
        
        existingUsuario.setNombre(usuario.getNombre());
        existingUsuario.setCorreo(usuario.getCorreo());
        existingUsuario.setContrasenaHash(usuario.getContrasenaHash());
        
        return usuarioRepository.save(existingUsuario);
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
    
    public Optional<Usuario> authenticate(String correo, String contrasenaHash) {
        return usuarioRepository.findByCorreoAndContrasenaHash(correo, contrasenaHash);
    }
    
    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setCorreo(usuario.getCorreo());
        
        // Determinar el tipo de usuario y llenar campos específicos
        if (usuario.getEstudiante() != null) {
            dto.setTipoUsuario("ESTUDIANTE");
            dto.setCodigoEstudiantil(usuario.getEstudiante().getCodigoEstudiantil());
            dto.setPrograma(usuario.getEstudiante().getPrograma());
        } else if (usuario.getDocente() != null) {
            dto.setTipoUsuario("DOCENTE");
            dto.setUnidadAcademica(usuario.getDocente().getUnidadAcademica());
            dto.setCargo(usuario.getDocente().getCargo());
        } else if (usuario.getSecretariaAcademica() != null) {
            dto.setTipoUsuario("SECRETARIA_ACADEMICA");
            dto.setFacultad(usuario.getSecretariaAcademica().getFacultad());
        } else {
            dto.setTipoUsuario("USUARIO_BASICO");
        }
        
        return dto;
    }
}
