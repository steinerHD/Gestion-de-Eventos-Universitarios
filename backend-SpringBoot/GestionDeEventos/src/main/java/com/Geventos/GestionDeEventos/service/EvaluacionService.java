package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.EvaluacionRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EvaluacionResponse;
import com.Geventos.GestionDeEventos.entity.*;
import com.Geventos.GestionDeEventos.mappers.EvaluacionMapper;
import com.Geventos.GestionDeEventos.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final EventoRepository eventoRepository;
    private final SecretariaAcademicaRepository secretariaAcademicaRepository;
    private final NotificacionRepository notificacionRepository;
    private final EvaluacionMapper evaluacionMapper;

    public List<EvaluacionResponse> findAll() {
        return evaluacionRepository.findAll()
                .stream()
                .map(evaluacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<EvaluacionResponse> findById(Long id) {
        return evaluacionRepository.findById(id)
                .map(evaluacionMapper::toResponse);
    }

    public List<EvaluacionResponse> findByEstado(Evaluacion.EstadoEvaluacion estado) {
        return evaluacionRepository.findByEstado(estado)
                .stream()
                .map(evaluacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<EvaluacionResponse> findByEventoId(Long idEvento) {
        return evaluacionRepository.findByEventoId(idEvento)
                .stream()
                .map(evaluacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<EvaluacionResponse> findBySecretariaId(Long idSecretaria) {
        return evaluacionRepository.findBySecretariaId(idSecretaria)
                .stream()
                .map(evaluacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<EvaluacionResponse> findByFecha(LocalDate fecha) {
        return evaluacionRepository.findByFecha(fecha)
                .stream()
                .map(evaluacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<EvaluacionResponse> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return evaluacionRepository.findByFechaBetween(fechaInicio, fechaFin)
                .stream()
                .map(evaluacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<EvaluacionResponse> findEvaluacionesPendientes() {
        return evaluacionRepository.findEvaluacionesPendientes()
                .stream()
                .map(evaluacionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public EvaluacionResponse save(EvaluacionRequest request) {
        // Buscar entidades relacionadas
        Evento evento = eventoRepository.findById(request.getIdEvento())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));

        SecretariaAcademica secretaria = secretariaAcademicaRepository.findById(request.getIdSecretaria())
                .orElseThrow(() -> new IllegalArgumentException("Secretaria académica no encontrada"));

        // Si no se proporciona fecha, usar la fecha actual
        if (request.getFecha() == null) {
            request.setFecha(LocalDate.now());
        }

        // Validar fecha - permitir hasta el día siguiente para evitar problemas de zona horaria
        if (request.getFecha().isAfter(LocalDate.now().plusDays(1))) {
            throw new IllegalArgumentException("La fecha de evaluación no puede ser en el futuro");
        }

        // Convertir DTO a entidad
        Evaluacion evaluacion = evaluacionMapper.toEntity(request, evento, secretaria);

        Evaluacion savedEvaluacion = evaluacionRepository.save(evaluacion);

        // Actualizar el estado del evento según la evaluación
        if (evaluacion.getEstado() == Evaluacion.EstadoEvaluacion.Aprobado) {
            evento.setEstado(Evento.EstadoEvento.Aprobado);
        } else if (evaluacion.getEstado() == Evaluacion.EstadoEvaluacion.Rechazado) {
            evento.setEstado(Evento.EstadoEvento.Rechazado);
        }
        eventoRepository.save(evento);

        crearNotificacionEvaluacion(savedEvaluacion);

        return evaluacionMapper.toResponse(savedEvaluacion);
    }

    public EvaluacionResponse update(Long id, EvaluacionRequest request) {
        Evaluacion existingEvaluacion = evaluacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evaluación no encontrada"));

        // Si no se proporciona fecha, mantener la existente
        if (request.getFecha() == null) {
            request.setFecha(existingEvaluacion.getFecha());
        }

        // Validar fecha - permitir hasta el día siguiente para evitar problemas de zona horaria
        if (request.getFecha().isAfter(LocalDate.now().plusDays(1))) {
            throw new IllegalArgumentException("La fecha de evaluación no puede ser en el futuro");
        }

        existingEvaluacion.setEstado(request.getEstado());
        existingEvaluacion.setFecha(request.getFecha());
        existingEvaluacion.setJustificacion(request.getJustificacion());
        if (request.getActaPdf() != null) {
            existingEvaluacion.setActaPdf(request.getActaPdf());
        }

        Evaluacion updated = evaluacionRepository.save(existingEvaluacion);
        return evaluacionMapper.toResponse(updated);
    }

    public void deleteById(Long id) {
        if (!evaluacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Evaluación no encontrada");
        }
        evaluacionRepository.deleteById(id);
    }

    private void crearNotificacionEvaluacion(Evaluacion evaluacion) {
        // Obtener el organizador principal del evento
        Usuario organizador = evaluacion.getEvento().getOrganizador();
        
        if (organizador != null) {
            Notificacion notificacion = new Notificacion();
            notificacion.setEvaluacion(evaluacion);
            notificacion.setUsuario(organizador);
            notificacion.setLeida(false);
            
            if (evaluacion.getEstado() == Evaluacion.EstadoEvaluacion.Aprobado) {
                notificacion.setMensaje("Tu evento '" + evaluacion.getEvento().getTitulo() + "' ha sido aprobado por la Secretaría Académica.");
                notificacion.setTipoNotificacion(Notificacion.TipoNotificacion.EVENTO_APROBADO);
            } else if (evaluacion.getEstado() == Evaluacion.EstadoEvaluacion.Rechazado) {
                notificacion.setMensaje("Tu evento '" + evaluacion.getEvento().getTitulo() + "' ha sido rechazado por la Secretaría Académica.");
                notificacion.setTipoNotificacion(Notificacion.TipoNotificacion.EVENTO_RECHAZADO);
            }
            
            notificacionRepository.save(notificacion);
        }
    }
}
