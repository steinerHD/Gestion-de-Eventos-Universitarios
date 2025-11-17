package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.InstalacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.InstalacionResponse;
import com.Geventos.GestionDeEventos.entity.Instalacion;
import com.Geventos.GestionDeEventos.mappers.InstalacionMapper;
import com.Geventos.GestionDeEventos.repository.InstalacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class InstalacionService {

    private final InstalacionRepository instalacionRepository;

    public List<InstalacionResponse> findAll() {
        return instalacionRepository.findAll()
                .stream()
                .map(InstalacionMapper::toResponse)
                .toList();
    }

    public InstalacionResponse findById(Long id) {
        Instalacion instalacion = instalacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Instalación no encontrada"));
        return InstalacionMapper.toResponse(instalacion);
    }

    public List<InstalacionResponse> findByTipo(String tipo) {
        return instalacionRepository.findByTipo(tipo)
                .stream()
                .map(InstalacionMapper::toResponse)
                .toList();
    }

    public List<InstalacionResponse> findByCapacidadGreaterThanEqual(Integer capacidad) {
        return instalacionRepository.findByCapacidadGreaterThanEqual(capacidad)
                .stream()
                .map(InstalacionMapper::toResponse)
                .toList();
    }

    public List<InstalacionResponse> findByNombreContaining(String nombre) {
        return instalacionRepository.findByNombreContaining(nombre)
                .stream()
                .map(InstalacionMapper::toResponse)
                .toList();
    }

    public List<InstalacionResponse> findByUbicacionContaining(String ubicacion) {
        return instalacionRepository.findByUbicacionContaining(ubicacion)
                .stream()
                .map(InstalacionMapper::toResponse)
                .toList();
    }

    public InstalacionResponse save(InstalacionRequest request) {
        Instalacion instalacion = InstalacionMapper.toEntity(request);
        if (instalacion.getCapacidad() <= 0) {
            throw new IllegalArgumentException("La capacidad debe ser mayor a 0");
        }
        return InstalacionMapper.toResponse(instalacionRepository.save(instalacion));
    }

    public InstalacionResponse update(Long id, InstalacionRequest request) {
        Instalacion existing = instalacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Instalación no encontrada"));

        if (request.getCapacidad() <= 0) {
            throw new IllegalArgumentException("La capacidad debe ser mayor a 0");
        }

        existing.setNombre(request.getNombre());
        existing.setTipo(request.getTipo());
        existing.setUbicacion(request.getUbicacion());
        existing.setCapacidad(request.getCapacidad());

        return InstalacionMapper.toResponse(instalacionRepository.save(existing));
    }

    public void deleteById(Long id) {
        if (!instalacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Instalación no encontrada");
        }
        instalacionRepository.deleteById(id);
    }
}
