package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Instalacion;
import com.Geventos.GestionDeEventos.repository.InstalacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class InstalacionService {
    
    private final InstalacionRepository instalacionRepository;
    
    public List<Instalacion> findAll() {
        return instalacionRepository.findAll();
    }
    
    public Optional<Instalacion> findById(Long id) {
        return instalacionRepository.findById(id);
    }
    
    public List<Instalacion> findByTipo(String tipo) {
        return instalacionRepository.findByTipo(tipo);
    }
    
    public List<Instalacion> findByCapacidadGreaterThanEqual(Integer capacidad) {
        return instalacionRepository.findByCapacidadGreaterThanEqual(capacidad);
    }
    
    public List<Instalacion> findByNombreContaining(String nombre) {
        return instalacionRepository.findByNombreContaining(nombre);
    }
    
    public List<Instalacion> findByUbicacionContaining(String ubicacion) {
        return instalacionRepository.findByUbicacionContaining(ubicacion);
    }
    
    public Instalacion save(Instalacion instalacion) {
        // Validar que la capacidad sea positiva
        if (instalacion.getCapacidad() <= 0) {
            throw new IllegalArgumentException("La capacidad debe ser mayor a 0");
        }
        
        return instalacionRepository.save(instalacion);
    }
    
    public Instalacion update(Long id, Instalacion instalacion) {
        Instalacion existingInstalacion = instalacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Instalación no encontrada"));
        
        // Validar que la capacidad sea positiva
        if (instalacion.getCapacidad() <= 0) {
            throw new IllegalArgumentException("La capacidad debe ser mayor a 0");
        }
        
        existingInstalacion.setNombre(instalacion.getNombre());
        existingInstalacion.setTipo(instalacion.getTipo());
        existingInstalacion.setUbicacion(instalacion.getUbicacion());
        existingInstalacion.setCapacidad(instalacion.getCapacidad());
        
        return instalacionRepository.save(existingInstalacion);
    }
    
    public void deleteById(Long id) {
        if (!instalacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Instalación no encontrada");
        }
        instalacionRepository.deleteById(id);
    }
}
