package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.SecretariaAcademicaRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class SecretariaAcademicaService {
    
    private final SecretariaAcademicaRepository secretariaAcademicaRepository;
    private final UsuarioRepository usuarioRepository;
    
    public List<SecretariaAcademica> findAll() {
        return secretariaAcademicaRepository.findAll();
    }
    
    public Optional<SecretariaAcademica> findById(Long id) {
        return secretariaAcademicaRepository.findById(id);
    }
    
    public Optional<SecretariaAcademica> findByUsuarioId(Long idUsuario) {
        return secretariaAcademicaRepository.findByUsuarioId(idUsuario);
    }
    
    public List<SecretariaAcademica> findByFacultad(String facultad) {
        return secretariaAcademicaRepository.findByFacultad(facultad);
    }
    
    public SecretariaAcademica save(Long idUsuario, String facultad) {
        // Validar que el usuario exista
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Validar que el usuario no sea ya estudiante, docente o secretaria
        if (secretariaAcademicaRepository.findByUsuarioId(idUsuario).isPresent()) {
            throw new IllegalArgumentException("El usuario ya es una secretaria académica");
        }

        // Crear nueva secretaria académica sin ID para evitar StaleObjectStateException
        SecretariaAcademica secretariaAcademica = new SecretariaAcademica();
        secretariaAcademica.setUsuario(usuario);
        secretariaAcademica.setFacultad(facultad);
        // No establecer ID - dejar que JPA genere uno nuevo o use @MapsId si está configurado
        
        return secretariaAcademicaRepository.save(secretariaAcademica);
    }
    
    // Método sobrecargado para compatibilidad con el controlador existente
    public SecretariaAcademica save(SecretariaAcademica secretariaAcademica) {
        if (secretariaAcademica.getIdSecretaria() != null) {
            // Si tiene ID, usar el método específico
            return save(secretariaAcademica.getIdSecretaria(), secretariaAcademica.getFacultad());
        } else {
            // Si no tiene ID, crear nueva
            return secretariaAcademicaRepository.save(secretariaAcademica);
        }
    }
    
    public SecretariaAcademica update(Long id, SecretariaAcademica secretariaAcademica) {
        SecretariaAcademica existingSecretaria = secretariaAcademicaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Secretaria académica no encontrada"));
        
        existingSecretaria.setFacultad(secretariaAcademica.getFacultad());
        
        return secretariaAcademicaRepository.save(existingSecretaria);
    }
    
    public void deleteById(Long id) {
        if (!secretariaAcademicaRepository.existsById(id)) {
            throw new IllegalArgumentException("Secretaria académica no encontrada");
        }
        secretariaAcademicaRepository.deleteById(id);
    }
}
