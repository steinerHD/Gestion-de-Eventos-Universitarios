package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Notificacion;
import com.Geventos.GestionDeEventos.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificacionService {
    
    private final NotificacionRepository notificacionRepository;
    
    public List<Notificacion> findAll() {
        return notificacionRepository.findAll();
    }
    
    public Optional<Notificacion> findById(Long id) {
        return notificacionRepository.findById(id);
    }
    
    public List<Notificacion> findByEvaluacionId(Long idEvaluacion) {
        return notificacionRepository.findByEvaluacionId(idEvaluacion);
    }
    
    public List<Notificacion> findByFechaEnvioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return notificacionRepository.findByFechaEnvioBetween(fechaInicio, fechaFin);
    }
    
    public List<Notificacion> findNotificacionesRecientes(LocalDateTime fecha) {
        return notificacionRepository.findNotificacionesRecientes(fecha);
    }
    
    public Notificacion save(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }
    
    public Notificacion update(Long id, Notificacion notificacion) {
        Notificacion existingNotificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notificación no encontrada"));
        
        existingNotificacion.setMensaje(notificacion.getMensaje());
        
        return notificacionRepository.save(existingNotificacion);
    }
    
    public void deleteById(Long id) {
        if (!notificacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Notificación no encontrada");
        }
        notificacionRepository.deleteById(id);
    }
}
