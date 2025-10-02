package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Estudiante;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.EstudianteRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EstudianteService {
    
    private final EstudianteRepository estudianteRepository;
    private final UsuarioRepository usuarioRepository;
    
    public List<Estudiante> findAll() {
        return estudianteRepository.findAll();
    }
    
    public Optional<Estudiante> findById(Long id) {
        return estudianteRepository.findById(id);
    }
    
    public Optional<Estudiante> findByCodigoEstudiantil(String codigoEstudiantil) {
        return estudianteRepository.findByCodigoEstudiantil(codigoEstudiantil);
    }
    
    public Optional<Estudiante> findByUsuarioId(Long idUsuario) {
        return estudianteRepository.findByUsuarioId(idUsuario);
    }
    
public Estudiante save(Long idUsuario, Estudiante estudiante) {
    // Validar que el usuario exista
    Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

    // Validar que el código estudiantil no exista
    if (estudianteRepository.existsByCodigoEstudiantil(estudiante.getCodigoEstudiantil())) {
        throw new IllegalArgumentException("El código estudiantil ya está registrado");
    }

    // Validar que el usuario no sea ya estudiante
    if (estudianteRepository.findByUsuarioId(idUsuario).isPresent()) {
        throw new IllegalArgumentException("El usuario ya es un estudiante");
    }

    // Asociar usuario; MapsId pone la PK igual al id del usuario
    estudiante.setUsuario(usuario);

    return estudianteRepository.save(estudiante);
}

    
    public Estudiante update(Long id, Estudiante estudiante) {
        Estudiante existingEstudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));
        
        // Validar que el código estudiantil no esté en uso por otro estudiante
        if (!existingEstudiante.getCodigoEstudiantil().equals(estudiante.getCodigoEstudiantil()) && 
            estudianteRepository.existsByCodigoEstudiantil(estudiante.getCodigoEstudiantil())) {
            throw new IllegalArgumentException("El código estudiantil ya está registrado por otro estudiante");
        }
        
        existingEstudiante.setCodigoEstudiantil(estudiante.getCodigoEstudiantil());
        existingEstudiante.setPrograma(estudiante.getPrograma());
        
        return estudianteRepository.save(existingEstudiante);
    }
    
    public void deleteById(Long id) {
        if (!estudianteRepository.existsById(id)) {
            throw new IllegalArgumentException("Estudiante no encontrado");
        }
        estudianteRepository.deleteById(id);
    }
    
    public boolean existsByCodigoEstudiantil(String codigoEstudiantil) {
        return estudianteRepository.existsByCodigoEstudiantil(codigoEstudiantil);
    }
}
