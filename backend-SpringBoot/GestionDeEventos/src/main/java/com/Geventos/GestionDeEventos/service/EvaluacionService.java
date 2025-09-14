package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.*;
import com.Geventos.GestionDeEventos.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluacionService {
    
    private final EvaluacionRepository evaluacionRepository;
    private final EventoRepository eventoRepository;
    private final SecretariaAcademicaRepository secretariaAcademicaRepository;
    private final NotificacionRepository notificacionRepository;
    
    public List<Evaluacion> findAll() {
        return evaluacionRepository.findAll();
    }
    
    public Optional<Evaluacion> findById(Long id) {
        return evaluacionRepository.findById(id);
    }
    
    public List<Evaluacion> findByEstado(Evaluacion.EstadoEvaluacion estado) {
        return evaluacionRepository.findByEstado(estado);
    }
    
    public List<Evaluacion> findByEventoId(Long idEvento) {
        return evaluacionRepository.findByEventoId(idEvento);
    }
    
    public List<Evaluacion> findBySecretariaId(Long idSecretaria) {
        return evaluacionRepository.findBySecretariaId(idSecretaria);
    }
    
    public List<Evaluacion> findByFecha(LocalDate fecha) {
        return evaluacionRepository.findByFecha(fecha);
    }
    
    public List<Evaluacion> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return evaluacionRepository.findByFechaBetween(fechaInicio, fechaFin);
    }
    
    public List<Evaluacion> findEvaluacionesPendientes() {
        return evaluacionRepository.findEvaluacionesPendientes();
    }
    
    public Evaluacion save(Evaluacion evaluacion) {
        // Validar que el evento exista
        Evento evento = eventoRepository.findById(evaluacion.getEvento().getIdEvento())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));
        
        // Validar que la secretaria exista
        SecretariaAcademica secretaria = secretariaAcademicaRepository.findById(evaluacion.getSecretaria().getIdSecretaria())
                .orElseThrow(() -> new IllegalArgumentException("Secretaria académica no encontrada"));
        
        // Validar que la fecha no sea en el futuro
        if (evaluacion.getFecha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de evaluación no puede ser en el futuro");
        }
        
        evaluacion.setEvento(evento);
        evaluacion.setSecretaria(secretaria);
        
        Evaluacion savedEvaluacion = evaluacionRepository.save(evaluacion);
        
        // Crear notificación automática (simulando el trigger de BD)
        crearNotificacionEvaluacion(savedEvaluacion);
        
        return savedEvaluacion;
    }
    
    public Evaluacion update(Long id, Evaluacion evaluacion) {
        Evaluacion existingEvaluacion = evaluacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evaluación no encontrada"));
        
        // Validar que la fecha no sea en el futuro
        if (evaluacion.getFecha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de evaluación no puede ser en el futuro");
        }
        
        existingEvaluacion.setEstado(evaluacion.getEstado());
        existingEvaluacion.setFecha(evaluacion.getFecha());
        existingEvaluacion.setJustificacion(evaluacion.getJustificacion());
        existingEvaluacion.setActaPdf(evaluacion.getActaPdf());
        
        return evaluacionRepository.save(existingEvaluacion);
    }
    
    public void deleteById(Long id) {
        if (!evaluacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Evaluación no encontrada");
        }
        evaluacionRepository.deleteById(id);
    }
    
    private void crearNotificacionEvaluacion(Evaluacion evaluacion) {
        Notificacion notificacion = new Notificacion();
        notificacion.setEvaluacion(evaluacion);
        notificacion.setMensaje("El evento ha sido " + evaluacion.getEstado().toString() + " por la Secretaría Académica.");
        
        notificacionRepository.save(notificacion);
    }
}
