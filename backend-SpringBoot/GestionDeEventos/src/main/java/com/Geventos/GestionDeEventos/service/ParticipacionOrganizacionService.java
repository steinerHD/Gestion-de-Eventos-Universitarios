package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.ParticipacionOrganizacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.ParticipacionOrganizacionResponse;
import com.Geventos.GestionDeEventos.entity.*;
import com.Geventos.GestionDeEventos.mappers.ParticipacionOrganizacionMapper;
import com.Geventos.GestionDeEventos.repository.*;
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
public class ParticipacionOrganizacionService {

    private final ParticipacionOrganizacionRepository participacionOrganizacionRepository;
    private final EventoRepository eventoRepository;
    private final OrganizacionExternaRepository organizacionExternaRepository;

    public List<ParticipacionOrganizacionResponse> findAll() {
        return participacionOrganizacionRepository.findAll()
                .stream()
                .map(ParticipacionOrganizacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<ParticipacionOrganizacionResponse> findById(ParticipacionOrganizacionId id) {
        return participacionOrganizacionRepository.findById(id)
                .map(ParticipacionOrganizacionMapper::toResponse);
    }

    public List<ParticipacionOrganizacionResponse> findByEventoId(Long idEvento) {
        return participacionOrganizacionRepository.findByEventoId(idEvento)
                .stream()
                .map(ParticipacionOrganizacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ParticipacionOrganizacionResponse> findByOrganizacionId(Long idOrganizacion) {
        return participacionOrganizacionRepository.findByOrganizacionId(idOrganizacion)
                .stream()
                .map(ParticipacionOrganizacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ParticipacionOrganizacionResponse> findByRepresentanteDiferenteTrue() {
        return participacionOrganizacionRepository.findByRepresentanteDiferenteTrue()
                .stream()
                .map(ParticipacionOrganizacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ParticipacionOrganizacionResponse save(ParticipacionOrganizacionRequest request) {
        // Validar existencia del evento
        Evento evento = eventoRepository.findById(request.getIdEvento())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));

        // Validar existencia de la organización externa
        OrganizacionExterna organizacion = organizacionExternaRepository.findById(request.getIdOrganizacion())
                .orElseThrow(() -> new IllegalArgumentException("Organización externa no encontrada"));

        // Validar duplicados
        ParticipacionOrganizacionId id = new ParticipacionOrganizacionId(request.getIdEvento(), request.getIdOrganizacion());
        if (participacionOrganizacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Ya existe una participación para este evento y organización");
        }

        // Validar campos obligatorios
        if (Boolean.TRUE.equals(request.getRepresentanteDiferente()) &&
                (request.getNombreRepresentanteDiferente() == null || request.getNombreRepresentanteDiferente().trim().isEmpty())) {
            throw new IllegalArgumentException("El nombre del representante diferente es obligatorio cuando representanteDiferente es true");
        }

        ParticipacionOrganizacion entity = ParticipacionOrganizacionMapper.toEntity(request, evento, organizacion);
        ParticipacionOrganizacion saved = participacionOrganizacionRepository.save(entity);

        return ParticipacionOrganizacionMapper.toResponse(saved);
    }

    public ParticipacionOrganizacionResponse update(ParticipacionOrganizacionId id, ParticipacionOrganizacionRequest request) {
        ParticipacionOrganizacion existing = participacionOrganizacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Participación de organización no encontrada"));

        // Validar campos obligatorios
        if (Boolean.TRUE.equals(request.getRepresentanteDiferente()) &&
                (request.getNombreRepresentanteDiferente() == null || request.getNombreRepresentanteDiferente().trim().isEmpty())) {
            throw new IllegalArgumentException("El nombre del representante diferente es obligatorio cuando representanteDiferente es true");
        }

        // Actualizar datos
        existing.setCertificadoPdf(request.getCertificadoPdf());
        existing.setRepresentanteDiferente(request.getRepresentanteDiferente());
        existing.setNombreRepresentanteDiferente(request.getNombreRepresentanteDiferente());

        ParticipacionOrganizacion updated = participacionOrganizacionRepository.save(existing);
        return ParticipacionOrganizacionMapper.toResponse(updated);
    }

    public void deleteById(ParticipacionOrganizacionId id) {
        if (!participacionOrganizacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Participación de organización no encontrada");
        }
        participacionOrganizacionRepository.deleteById(id);
    }
}
