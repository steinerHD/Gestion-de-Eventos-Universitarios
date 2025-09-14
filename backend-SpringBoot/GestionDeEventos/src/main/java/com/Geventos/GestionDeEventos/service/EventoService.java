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
public class EventoService {
    
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final InstalacionRepository instalacionRepository;
    
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }
    
    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
    }
    
    public List<Evento> findByTipoEvento(Evento.TipoEvento tipoEvento) {
        return eventoRepository.findByTipoEvento(tipoEvento);
    }
    
    public List<Evento> findByFecha(LocalDate fecha) {
        return eventoRepository.findByFecha(fecha);
    }
    
    public List<Evento> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return eventoRepository.findByFechaBetween(fechaInicio, fechaFin);
    }
    
    public List<Evento> findByOrganizadorId(Long idOrganizador) {
        return eventoRepository.findByOrganizadorId(idOrganizador);
    }
    
    public List<Evento> findByInstalacionId(Long idInstalacion) {
        return eventoRepository.findByInstalacionId(idInstalacion);
    }
    
    public List<Evento> findByTituloContaining(String titulo) {
        return eventoRepository.findByTituloContaining(titulo);
    }
    
    public List<Evento> findEventosFuturos(LocalDate fecha) {
        return eventoRepository.findEventosFuturos(fecha);
    }
    
    public Evento save(Evento evento) {
        // Validar que el organizador exista
        Usuario organizador = usuarioRepository.findById(evento.getOrganizador().getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Organizador no encontrado"));
        
        // Validar que el organizador sea estudiante o docente (trigger de BD)
        boolean esEstudiante = estudianteRepository.findByUsuarioId(organizador.getIdUsuario()).isPresent();
        boolean esDocente = docenteRepository.findByUsuarioId(organizador.getIdUsuario()).isPresent();
        
        if (!esEstudiante && !esDocente) {
            throw new IllegalArgumentException("Solo estudiantes o docentes pueden organizar eventos");
        }
        
        // Validar que la instalación exista
        if (evento.getInstalacion() != null) {
            Instalacion instalacion = instalacionRepository.findById(evento.getInstalacion().getIdInstalacion())
                    .orElseThrow(() -> new IllegalArgumentException("Instalación no encontrada"));
            evento.setInstalacion(instalacion);
        }
        
        // Validar que la fecha no sea en el pasado
        if (evento.getFecha().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha del evento no puede ser en el pasado");
        }
        
        evento.setOrganizador(organizador);
        return eventoRepository.save(evento);
    }
    
    public Evento update(Long id, Evento evento) {
        Evento existingEvento = eventoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));
        
        // Validar que el organizador exista
        Usuario organizador = usuarioRepository.findById(evento.getOrganizador().getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Organizador no encontrado"));
        
        // Validar que el organizador sea estudiante o docente (trigger de BD)
        boolean esEstudiante = estudianteRepository.findByUsuarioId(organizador.getIdUsuario()).isPresent();
        boolean esDocente = docenteRepository.findByUsuarioId(organizador.getIdUsuario()).isPresent();
        
        if (!esEstudiante && !esDocente) {
            throw new IllegalArgumentException("Solo estudiantes o docentes pueden organizar eventos");
        }
        
        // Validar que la instalación exista
        if (evento.getInstalacion() != null) {
            Instalacion instalacion = instalacionRepository.findById(evento.getInstalacion().getIdInstalacion())
                    .orElseThrow(() -> new IllegalArgumentException("Instalación no encontrada"));
            evento.setInstalacion(instalacion);
        }
        
        // Validar que la fecha no sea en el pasado
        if (evento.getFecha().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha del evento no puede ser en el pasado");
        }
        
        existingEvento.setTitulo(evento.getTitulo());
        existingEvento.setTipoEvento(evento.getTipoEvento());
        existingEvento.setFecha(evento.getFecha());
        existingEvento.setHora(evento.getHora());
        existingEvento.setInstalacion(evento.getInstalacion());
        existingEvento.setOrganizador(organizador);
        existingEvento.setAvalPdf(evento.getAvalPdf());
        existingEvento.setTipoAval(evento.getTipoAval());
        
        return eventoRepository.save(existingEvento);
    }
    
    public void deleteById(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new IllegalArgumentException("Evento no encontrado");
        }
        eventoRepository.deleteById(id);
    }
}
