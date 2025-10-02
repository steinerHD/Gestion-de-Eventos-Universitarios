package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
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
}
