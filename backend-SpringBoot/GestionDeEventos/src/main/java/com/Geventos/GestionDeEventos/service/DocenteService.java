package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.DocenteRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.DocenteResponse;
import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.mappers.DocenteMapper;
import com.Geventos.GestionDeEventos.repository.DocenteRepository;
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
public class DocenteService {

    private final DocenteRepository docenteRepository;
    private final UsuarioRepository usuarioRepository;

    public List<DocenteResponse> findAll() {
        return docenteRepository.findAll()
                .stream()
                .map(DocenteMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<DocenteResponse> findById(Long id) {
        return docenteRepository.findById(id)
                .map(DocenteMapper::toResponse);
    }

    public Optional<DocenteResponse> findByUsuarioId(Long idUsuario) {
        return docenteRepository.findByUsuarioId(idUsuario)
                .map(DocenteMapper::toResponse);
    }

    public List<DocenteResponse> findByUnidadAcademica(String unidadAcademica) {
        return docenteRepository.findByUnidadAcademica(unidadAcademica)
                .stream()
                .map(DocenteMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<DocenteResponse> findByCargo(String cargo) {
        return docenteRepository.findByCargo(cargo)
                .stream()
                .map(DocenteMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Docente save(DocenteRequest request) {
        // Validar usuario existente
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario asociado no encontrado"));

        // Crear la entidad docente
        Docente docente = new Docente();
        docente.setUsuario(usuario);
        docente.setUnidadAcademica(request.getUnidadAcademica());
        docente.setCargo(request.getCargo());
       

        return docenteRepository.save(docente);
        
    }

    /**
     * Actualiza un docente existente usando un DocenteRequest.
     * @param id id del docente a actualizar
     * @param request datos nuevos
     * @return DocenteResponse actualizado
     * @throws IllegalArgumentException si docente o usuario no existen
     */
    public DocenteResponse update(Long id, DocenteRequest request) {
        Docente existing = docenteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Docente no encontrado"));

        // Validar que el usuario asociado exista
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario asociado no encontrado"));

        // Mapear campos (evitar sobreescribir id ni relación incorrecta)
        existing.setUnidadAcademica(request.getUnidadAcademica());
        existing.setCargo(request.getCargo());
        existing.setUsuario(usuario); // en tu diseño idDocente == idUsuario

        Docente saved = docenteRepository.save(existing);
        return DocenteMapper.toResponse(saved);
    }

    public void deleteById(Long id) {
        if (!docenteRepository.existsById(id)) {
            throw new IllegalArgumentException("Docente no encontrado");
        }
        docenteRepository.deleteById(id);
    }
}
