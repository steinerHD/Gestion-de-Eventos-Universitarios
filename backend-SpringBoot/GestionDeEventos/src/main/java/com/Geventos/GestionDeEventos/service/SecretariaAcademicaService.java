package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.SecretariaRequest;
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

    // Obtener todas las secretarias académicas
    public List<SecretariaAcademica> findAll() {
        return secretariaAcademicaRepository.findAll();
    }

    // Buscar por ID
    public Optional<SecretariaAcademica> findById(Long id) {
        return secretariaAcademicaRepository.findById(id);
    }

    // Buscar por ID de usuario
    public Optional<SecretariaAcademica> findByUsuarioId(Long idUsuario) {
        return secretariaAcademicaRepository.findByUsuarioId(idUsuario);
    }

    // Buscar por facultad
    public List<SecretariaAcademica> findByFacultad(String facultad) {
        return secretariaAcademicaRepository.findByFacultad(facultad);
    }

    // Crear nueva secretaria académica desde un Request DTO
    public SecretariaAcademica save(SecretariaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (secretariaAcademicaRepository.findByUsuarioId(request.getIdUsuario()).isPresent()) {
            throw new IllegalArgumentException("El usuario ya está asignado como secretaria académica");
        }

        SecretariaAcademica secretaria = new SecretariaAcademica();
        secretaria.setUsuario(usuario);
        secretaria.setFacultad(request.getFacultad());

        return secretariaAcademicaRepository.save(secretaria);
    }

    // Crear (versión sobrecargada para compatibilidad directa)
    public SecretariaAcademica save(SecretariaAcademica secretariaAcademica) {
        if (secretariaAcademica.getUsuario() == null) {
            throw new IllegalArgumentException("Debe asignar un usuario válido a la secretaria");
        }
        return secretariaAcademicaRepository.save(secretariaAcademica);
    }

    // Actualizar una secretaria existente
    public SecretariaAcademica update(Long id, SecretariaAcademica secretariaAcademica) {
        SecretariaAcademica existingSecretaria = secretariaAcademicaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Secretaria académica no encontrada"));

        existingSecretaria.setFacultad(secretariaAcademica.getFacultad());

        return secretariaAcademicaRepository.save(existingSecretaria);
    }

    // Eliminar una secretaria por ID
    public void deleteById(Long id) {
        if (!secretariaAcademicaRepository.existsById(id)) {
            throw new IllegalArgumentException("Secretaria académica no encontrada");
        }
        secretariaAcademicaRepository.deleteById(id);
    }
}
