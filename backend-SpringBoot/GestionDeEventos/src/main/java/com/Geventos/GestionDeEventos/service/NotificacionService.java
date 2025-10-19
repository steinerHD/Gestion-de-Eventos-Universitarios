package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.NotificacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.NotificacionResponse;
import com.Geventos.GestionDeEventos.entity.Evaluacion;
import com.Geventos.GestionDeEventos.entity.Notificacion;
import com.Geventos.GestionDeEventos.mappers.NotificacionMapper;
import com.Geventos.GestionDeEventos.repository.EvaluacionRepository;
import com.Geventos.GestionDeEventos.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final EvaluacionRepository evaluacionRepository;

    public List<NotificacionResponse> findAll() {
        return notificacionRepository.findAll()
                .stream()
                .map(NotificacionMapper::toResponse)
                .toList();
    }

    public NotificacionResponse findById(Long id) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notificación no encontrada"));
        return NotificacionMapper.toResponse(notificacion);
    }

    public List<NotificacionResponse> findByEvaluacionId(Long idEvaluacion) {
        return notificacionRepository.findByEvaluacionId(idEvaluacion)
                .stream()
                .map(NotificacionMapper::toResponse)
                .toList();
    }

    public List<NotificacionResponse> findByFechaEnvioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return notificacionRepository.findByFechaEnvioBetween(fechaInicio, fechaFin)
                .stream()
                .map(NotificacionMapper::toResponse)
                .toList();
    }

    public List<NotificacionResponse> findNotificacionesRecientes(LocalDateTime fecha) {
        return notificacionRepository.findNotificacionesRecientes(fecha)
                .stream()
                .map(NotificacionMapper::toResponse)
                .toList();
    }

    public NotificacionResponse save(NotificacionRequest request) {
        Evaluacion evaluacion = evaluacionRepository.findById(request.getIdEvaluacion())
                .orElseThrow(() -> new IllegalArgumentException("Evaluación no encontrada"));

        Notificacion notificacion = NotificacionMapper.toEntity(request, evaluacion);
        Notificacion saved = notificacionRepository.save(notificacion);
        return NotificacionMapper.toResponse(saved);
    }

    public NotificacionResponse update(Long id, NotificacionRequest request) {
        Notificacion existing = notificacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notificación no encontrada"));

        existing.setMensaje(request.getMensaje());
        Notificacion updated = notificacionRepository.save(existing);

        return NotificacionMapper.toResponse(updated);
    }

    public void deleteById(Long id) {
        if (!notificacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Notificación no encontrada");
        }
        notificacionRepository.deleteById(id);
    }
}
