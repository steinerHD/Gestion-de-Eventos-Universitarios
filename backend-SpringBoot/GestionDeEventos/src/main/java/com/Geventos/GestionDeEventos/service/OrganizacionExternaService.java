package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.OrganizacionExternaRequest;
import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.mappers.OrganizacionExternaMapper;
import com.Geventos.GestionDeEventos.repository.OrganizacionExternaRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizacionExternaService {

    private final OrganizacionExternaRepository organizacionExternaRepository;
    private final UsuarioRepository usuarioRepository;

    public List<OrganizacionExterna> findAll() {
        return organizacionExternaRepository.findAll();
    }

    public Optional<OrganizacionExterna> findById(Long id) {
        return organizacionExternaRepository.findById(id);
    }

    public Optional<OrganizacionExterna> findByNit(String nit) {
        return organizacionExternaRepository.findByNit(nit);
    }

    public List<OrganizacionExterna> findBySectorEconomico(String sectorEconomico) {
        return organizacionExternaRepository.findBySectorEconomico(sectorEconomico);
    }

    public List<OrganizacionExterna> findByNombreContaining(String nombre) {
        return organizacionExternaRepository.findByNombreContaining(nombre);
    }

    public List<OrganizacionExterna> findByRepresentanteLegalContaining(String representante) {
        return organizacionExternaRepository.findByRepresentanteLegalContaining(representante);
    }

    public List<OrganizacionExterna> findByUbicacionContaining(String ubicacion) {
        return organizacionExternaRepository.findByUbicacionContaining(ubicacion);
    }

    /**
     * Crea una organización y la asocia al usuario creador.
     */
    public OrganizacionExterna save(OrganizacionExternaRequest request, Long idCreador) {
        if (organizacionExternaRepository.findByNit(request.getNit()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una organización con este NIT");
        }

        Usuario creador = usuarioRepository.findById(idCreador)
                .orElseThrow(() -> new IllegalArgumentException("Usuario creador no encontrado"));

        OrganizacionExterna organizacion = OrganizacionExternaMapper.toEntity(request);
        organizacion.setCreador(creador);

        return organizacionExternaRepository.save(organizacion);
    }

    /**
     * Permite editar solo si el usuario autenticado es el creador.
     */
    public OrganizacionExterna update(Long id, OrganizacionExternaRequest request, Long idUsuarioActual) {
        OrganizacionExterna existing = organizacionExternaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organización externa no encontrada"));

        if (!existing.getCreador().getIdUsuario().equals(idUsuarioActual)) {
            throw new SecurityException("No tienes permiso para editar esta organización");
        }

        existing.setNit(request.getNit());
        existing.setNombre(request.getNombre());
        existing.setRepresentanteLegal(request.getRepresentanteLegal());
        existing.setTelefono(request.getTelefono());
        existing.setUbicacion(request.getUbicacion());
        existing.setSectorEconomico(request.getSectorEconomico());
        existing.setActividadPrincipal(request.getActividadPrincipal());

        return organizacionExternaRepository.save(existing);
    }

    /**
     * Permite eliminar solo si el usuario autenticado es el creador.
     */
    public void deleteById(Long id, Long idUsuarioActual) {
        OrganizacionExterna existing = organizacionExternaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organización externa no encontrada"));

        if (!existing.getCreador().getIdUsuario().equals(idUsuarioActual)) {
            throw new SecurityException("No tienes permiso para eliminar esta organización");
        }

        organizacionExternaRepository.delete(existing);
    }
}
