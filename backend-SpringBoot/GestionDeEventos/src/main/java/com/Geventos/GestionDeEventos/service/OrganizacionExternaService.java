package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.OrganizacionExternaRequest;
import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
import com.Geventos.GestionDeEventos.mappers.OrganizacionExternaMapper;
import com.Geventos.GestionDeEventos.repository.OrganizacionExternaRepository;
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

    public OrganizacionExterna save(OrganizacionExternaRequest request) {
        if (organizacionExternaRepository.findByNit(request.getNit()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una organización con este NIT");
        }

        OrganizacionExterna organizacion = OrganizacionExternaMapper.toEntity(request);
        return organizacionExternaRepository.save(organizacion);
    }

    public OrganizacionExterna update(Long id, OrganizacionExternaRequest request) {
        OrganizacionExterna existing = organizacionExternaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organización externa no encontrada"));

        existing.setNit(request.getNit());
        existing.setNombre(request.getNombre());
        existing.setRepresentanteLegal(request.getRepresentanteLegal());
        existing.setTelefono(request.getTelefono());
        existing.setUbicacion(request.getUbicacion());
        existing.setSectorEconomico(request.getSectorEconomico());
        existing.setActividadPrincipal(request.getActividadPrincipal());

        return organizacionExternaRepository.save(existing);
    }

    public void deleteById(Long id) {
        if (!organizacionExternaRepository.existsById(id)) {
            throw new IllegalArgumentException("Organización externa no encontrada");
        }
        organizacionExternaRepository.deleteById(id);
    }
}
