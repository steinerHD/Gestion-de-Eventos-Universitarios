package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
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
    
    public OrganizacionExterna save(OrganizacionExterna organizacionExterna) {
        // Validar que el teléfono tenga formato válido (básico)
        if (organizacionExterna.getTelefono() == null || organizacionExterna.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio");
        }
        
        return organizacionExternaRepository.save(organizacionExterna);
    }
    
    public OrganizacionExterna update(Long id, OrganizacionExterna organizacionExterna) {
        OrganizacionExterna existingOrganizacion = organizacionExternaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organización externa no encontrada"));
        
        // Validar que el teléfono tenga formato válido (básico)
        if (organizacionExterna.getTelefono() == null || organizacionExterna.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio");
        }

        existingOrganizacion.setNit(organizacionExterna.getNit());
        existingOrganizacion.setNombre(organizacionExterna.getNombre());
        existingOrganizacion.setRepresentanteLegal(organizacionExterna.getRepresentanteLegal());
        existingOrganizacion.setTelefono(organizacionExterna.getTelefono());
        existingOrganizacion.setUbicacion(organizacionExterna.getUbicacion());
        existingOrganizacion.setSectorEconomico(organizacionExterna.getSectorEconomico());
        existingOrganizacion.setActividadPrincipal(organizacionExterna.getActividadPrincipal());
        
        return organizacionExternaRepository.save(existingOrganizacion);
    }
    
    public void deleteById(Long id) {
        if (!organizacionExternaRepository.existsById(id)) {
            throw new IllegalArgumentException("Organización externa no encontrada");
        }
        organizacionExternaRepository.deleteById(id);
    }
}
