package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.SecretariaRequest;
import com.Geventos.GestionDeEventos.entity.PeriodoActivacion;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.PeriodoActivacionRepository;
import com.Geventos.GestionDeEventos.repository.SecretariaAcademicaRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class SecretariaAcademicaService {

    private final SecretariaAcademicaRepository secretariaAcademicaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PeriodoActivacionRepository periodoActivacionRepository;

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

    // Buscar secretaria activa por facultad
    public Optional<SecretariaAcademica> findActivaByFacultad(String facultad) {
        return secretariaAcademicaRepository.findByFacultadAndActivaTrue(facultad);
    }

    // Crear nueva secretaria académica desde un Request DTO
    public SecretariaAcademica save(SecretariaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (secretariaAcademicaRepository.findByUsuarioId(request.getIdUsuario()).isPresent()) {
            throw new IllegalArgumentException("El usuario ya está asignado como secretaria académica");
        }

        // Desactivar otras secretarias de la misma facultad y cerrar sus períodos
        List<SecretariaAcademica> secretariasMismaFacultad = 
            secretariaAcademicaRepository.findByFacultadAndActiva(request.getFacultad(), true);
        
        LocalDateTime ahora = LocalDateTime.now();
        for (SecretariaAcademica sec : secretariasMismaFacultad) {
            sec.setActiva(false);
            secretariaAcademicaRepository.save(sec);
            
            // Cerrar el período activo actual
            Optional<PeriodoActivacion> periodoActivo = 
                periodoActivacionRepository.findBySecretariaAndFechaFinIsNull(sec);
            if (periodoActivo.isPresent()) {
                PeriodoActivacion periodo = periodoActivo.get();
                periodo.setFechaFin(ahora);
                periodoActivacionRepository.save(periodo);
            }
        }

        // Crear nueva secretaria activa
        SecretariaAcademica secretaria = new SecretariaAcademica();
        secretaria.setUsuario(usuario);
        secretaria.setFacultad(request.getFacultad());
        secretaria.setActiva(true);
        secretaria.setFechaActivacion(ahora);

        secretaria = secretariaAcademicaRepository.save(secretaria);
        
        // Crear primer período de activación
        PeriodoActivacion nuevoPeriodo = new PeriodoActivacion();
        nuevoPeriodo.setSecretaria(secretaria);
        nuevoPeriodo.setFechaInicio(ahora);
        nuevoPeriodo.setFechaFin(null); // Periodo abierto
        periodoActivacionRepository.save(nuevoPeriodo);
        
        return secretaria;
    }

    // Activar una secretaria (desactiva las demás de la misma facultad)
    public SecretariaAcademica activar(Long idSecretaria) {
        SecretariaAcademica secretaria = secretariaAcademicaRepository.findById(idSecretaria)
                .orElseThrow(() -> new IllegalArgumentException("Secretaria académica no encontrada"));

        LocalDateTime ahora = LocalDateTime.now();
        
        // Desactivar otras secretarias de la misma facultad y cerrar sus períodos
        List<SecretariaAcademica> secretariasMismaFacultad = 
            secretariaAcademicaRepository.findByFacultadAndActiva(secretaria.getFacultad(), true);
        
        for (SecretariaAcademica sec : secretariasMismaFacultad) {
            if (!sec.getIdSecretaria().equals(idSecretaria)) {
                sec.setActiva(false);
                secretariaAcademicaRepository.save(sec);
                
                // Cerrar el período activo actual
                Optional<PeriodoActivacion> periodoActivo = 
                    periodoActivacionRepository.findBySecretariaAndFechaFinIsNull(sec);
                if (periodoActivo.isPresent()) {
                    PeriodoActivacion periodo = periodoActivo.get();
                    periodo.setFechaFin(ahora);
                    periodoActivacionRepository.save(periodo);
                }
            }
        }

        // Activar la secretaria solicitada
        secretaria.setActiva(true);
        if (secretaria.getFechaActivacion() == null) {
            secretaria.setFechaActivacion(ahora);
        }
        
        secretaria = secretariaAcademicaRepository.save(secretaria);
        
        // Crear nuevo período de activación
        PeriodoActivacion nuevoPeriodo = new PeriodoActivacion();
        nuevoPeriodo.setSecretaria(secretaria);
        nuevoPeriodo.setFechaInicio(ahora);
        nuevoPeriodo.setFechaFin(null); // Periodo abierto
        periodoActivacionRepository.save(nuevoPeriodo);

        return secretaria;
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
