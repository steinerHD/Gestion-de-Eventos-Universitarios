package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.EstudianteRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EstudianteResponse;
import com.Geventos.GestionDeEventos.entity.Estudiante;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.mappers.EstudianteMapper;
import com.Geventos.GestionDeEventos.repository.EstudianteRepository;
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
@SuppressWarnings("null")
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final UsuarioRepository usuarioRepository;

    // ------------------------------
    // MÉTODO SAVE NUEVO
    // ------------------------------
    public Estudiante save(EstudianteRequest request) {
        // Validar usuario existente
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Validar código único
        if (estudianteRepository.existsByCodigoEstudiantil(request.getCodigoEstudiantil())) {
            throw new IllegalArgumentException("El código estudiantil ya está registrado");
        }

        // Validar si ya existe un estudiante vinculado al usuario
        if (estudianteRepository.findByUsuarioId(usuario.getIdUsuario()).isPresent()) {
            throw new IllegalArgumentException("El usuario ya está registrado como estudiante");
        }

        // Crear entidad
        Estudiante estudiante = new Estudiante();
        estudiante.setUsuario(usuario);
        estudiante.setPrograma(request.getPrograma());
        estudiante.setCodigoEstudiantil(request.getCodigoEstudiantil());

        return estudianteRepository.save(estudiante);
    }

    // ------------------------------
    // RESTO DE MÉTODOS
    // ------------------------------

    public List<EstudianteResponse> findAll() {
        return estudianteRepository.findAll()
                .stream()
                .map(EstudianteMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<EstudianteResponse> findById(Long id) {
        return estudianteRepository.findById(id)
                .map(EstudianteMapper::toResponse);
    }

    public Optional<EstudianteResponse> findByCodigoEstudiantil(String codigoEstudiantil) {
        return estudianteRepository.findByCodigoEstudiantil(codigoEstudiantil)
                .map(EstudianteMapper::toResponse);
    }

    public Optional<EstudianteResponse> findByUsuarioId(Long idUsuario) {
        return estudianteRepository.findByUsuarioId(idUsuario)
                .map(EstudianteMapper::toResponse);
    }

    public EstudianteResponse update(Long id, EstudianteRequest request) {
        Estudiante existing = estudianteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));

        // Validar duplicidad de código
        if (!existing.getCodigoEstudiantil().equals(request.getCodigoEstudiantil()) &&
            estudianteRepository.existsByCodigoEstudiantil(request.getCodigoEstudiantil())) {
            throw new IllegalArgumentException("El código estudiantil ya está registrado");
        }

        existing.setCodigoEstudiantil(request.getCodigoEstudiantil());
        existing.setPrograma(request.getPrograma());

        Estudiante saved = estudianteRepository.save(existing);
        return EstudianteMapper.toResponse(saved);
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
