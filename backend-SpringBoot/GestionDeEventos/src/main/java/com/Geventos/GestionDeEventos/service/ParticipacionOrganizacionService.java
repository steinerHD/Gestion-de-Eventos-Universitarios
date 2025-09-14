package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.*;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacionId;
import com.Geventos.GestionDeEventos.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ParticipacionOrganizacionService {
    
    private final ParticipacionOrganizacionRepository participacionOrganizacionRepository;
    private final EventoRepository eventoRepository;
    private final OrganizacionExternaRepository organizacionExternaRepository;
    
    public List<ParticipacionOrganizacion> findAll() {
        return participacionOrganizacionRepository.findAll();
    }
    
    public Optional<ParticipacionOrganizacion> findById(ParticipacionOrganizacionId id) {
        return participacionOrganizacionRepository.findById(id);
    }
    
    public List<ParticipacionOrganizacion> findByEventoId(Long idEvento) {
        return participacionOrganizacionRepository.findByEventoId(idEvento);
    }
    
    public List<ParticipacionOrganizacion> findByOrganizacionId(Long idOrganizacion) {
        return participacionOrganizacionRepository.findByOrganizacionId(idOrganizacion);
    }
    
    public List<ParticipacionOrganizacion> findByRepresentanteDiferenteTrue() {
        return participacionOrganizacionRepository.findByRepresentanteDiferenteTrue();
    }
    
    public ParticipacionOrganizacion save(ParticipacionOrganizacion participacionOrganizacion) {
        // Validar que el evento exista
        Evento evento = eventoRepository.findById(participacionOrganizacion.getIdEvento())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));
        
        // Validar que la organización exista
        OrganizacionExterna organizacion = organizacionExternaRepository.findById(participacionOrganizacion.getIdOrganizacion())
                .orElseThrow(() -> new IllegalArgumentException("Organización externa no encontrada"));
        
        // Validar que no exista ya una participación para este evento y organización
        ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(
                participacionOrganizacion.getIdEvento(), 
                participacionOrganizacion.getIdOrganizacion()
        );
        if (participacionOrganizacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Ya existe una participación para este evento y organización");
        }
        
        // Validar que si representanteDiferente es true, el nombre del representante diferente no sea nulo
        if (participacionOrganizacion.getRepresentanteDiferente() && 
            (participacionOrganizacion.getNombreRepresentanteDiferente() == null || 
             participacionOrganizacion.getNombreRepresentanteDiferente().trim().isEmpty())) {
            throw new IllegalArgumentException("El nombre del representante diferente es obligatorio cuando representanteDiferente es true");
        }
        
        participacionOrganizacion.setEvento(evento);
        participacionOrganizacion.setOrganizacion(organizacion);
        
        return participacionOrganizacionRepository.save(participacionOrganizacion);
    }
    
    public ParticipacionOrganizacion update(ParticipacionOrganizacionId id, ParticipacionOrganizacion participacionOrganizacion) {
        ParticipacionOrganizacion existingParticipacion = participacionOrganizacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Participación de organización no encontrada"));
        
        // Validar que si representanteDiferente es true, el nombre del representante diferente no sea nulo
        if (participacionOrganizacion.getRepresentanteDiferente() && 
            (participacionOrganizacion.getNombreRepresentanteDiferente() == null || 
             participacionOrganizacion.getNombreRepresentanteDiferente().trim().isEmpty())) {
            throw new IllegalArgumentException("El nombre del representante diferente es obligatorio cuando representanteDiferente es true");
        }
        
        existingParticipacion.setCertificadoPdf(participacionOrganizacion.getCertificadoPdf());
        existingParticipacion.setRepresentanteDiferente(participacionOrganizacion.getRepresentanteDiferente());
        existingParticipacion.setNombreRepresentanteDiferente(participacionOrganizacion.getNombreRepresentanteDiferente());
        
        return participacionOrganizacionRepository.save(existingParticipacion);
    }
    
    public void deleteById(ParticipacionOrganizacionId id) {
        if (!participacionOrganizacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Participación de organización no encontrada");
        }
        participacionOrganizacionRepository.deleteById(id);
    }
}

