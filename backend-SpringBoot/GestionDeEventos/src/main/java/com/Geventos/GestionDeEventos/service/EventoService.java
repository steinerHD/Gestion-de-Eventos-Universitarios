package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.DTOs.Requests.EventoRequest;
import com.Geventos.GestionDeEventos.DTOs.Responses.EventoResponse;
import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.Instalacion;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacion;
import com.Geventos.GestionDeEventos.repository.*;
import com.Geventos.GestionDeEventos.mappers.EventoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EventoService {

    private final EventoRepository eventoRepository;
    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final InstalacionRepository instalacionRepository;
    private final OrganizacionExternaRepository organizacionExternaRepository;
    private final ParticipacionOrganizacionRepository participacionOrganizacionRepository;
    private final UsuarioService usuarioService;

    // ------------------------- CREATE / UPDATE -------------------------
    public EventoResponse createEvento(EventoRequest request) {
        Usuario organizador = usuarioService.findEntityById(request.getIdOrganizador())
                .orElseThrow(() -> new IllegalArgumentException("Organizador no encontrado"));

        List<Instalacion> instalaciones = getInstalacionesByIds(request.getInstalaciones());
        List<Usuario> coorganizadores = getUsuariosByIds(request.getCoorganizadores());

        Evento evento = EventoMapper.toEntity(request, organizador, instalaciones, coorganizadores);

        Evento savedEvento = save(evento); // método privado con todas las validaciones
        
        // Manejar organizaciones externas después de guardar el evento
        if (request.getOrganizacionesExternas() != null && !request.getOrganizacionesExternas().isEmpty()) {
            manejarOrganizacionesExternas(savedEvento.getIdEvento(), request.getOrganizacionesExternas());
        }
        
        return EventoMapper.toResponse(savedEvento);
    }

    public EventoResponse updateEvento(Long id, EventoRequest request) {
        Evento existingEvento = eventoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));

        Usuario organizador = usuarioService.findEntityById(request.getIdOrganizador())
                .orElseThrow(() -> new IllegalArgumentException("Organizador no encontrado"));

        List<Instalacion> instalaciones = getInstalacionesByIds(request.getInstalaciones());
        List<Usuario> coorganizadores = getUsuariosByIds(request.getCoorganizadores());

        existingEvento.setTitulo(request.getTitulo());
        existingEvento.setTipoEvento(request.getTipoEvento());
        existingEvento.setFecha(request.getFecha());
        existingEvento.setHoraInicio(request.getHoraInicio());
        existingEvento.setHoraFin(request.getHoraFin());
        existingEvento.setInstalaciones(instalaciones);
        existingEvento.setCoorganizadores(coorganizadores);
        existingEvento.setAvalPdf(request.getAvalPdf());
        existingEvento.setTipoAval(request.getTipoAval());
        existingEvento.setOrganizador(organizador);

        Evento updatedEvento = save(existingEvento);
        
        // Manejar organizaciones externas después de actualizar el evento
        if (request.getOrganizacionesExternas() != null) {
            manejarOrganizacionesExternas(id, request.getOrganizacionesExternas());
        }
        
        return EventoMapper.toResponse(updatedEvento);
    }

    // ------------------------- READ -------------------------
    public List<EventoResponse> findAllEventos() {
        return eventoRepository.findAll().stream()
                .map(EventoMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
    }

    public Optional<EventoResponse> findByIdEvento(Long id) {
        return eventoRepository.findById(id)
                .map(EventoMapper::toResponse);
    }

    public List<EventoResponse> findByTipoEvento(Evento.TipoEvento tipoEvento) {
        return eventoRepository.findByTipoEvento(tipoEvento)
                .stream().map(EventoMapper::toResponse).toList();
    }

    public List<EventoResponse> findByFecha(LocalDate fecha) {
        return eventoRepository.findByFecha(fecha)
                .stream().map(EventoMapper::toResponse).toList();
    }

    public List<EventoResponse> findByFechaBetween(LocalDate inicio, LocalDate fin) {
        return eventoRepository.findByFechaBetween(inicio, fin)
                .stream().map(EventoMapper::toResponse).toList();
    }

    public List<EventoResponse> findByOrganizadorId(Long idOrganizador) {
        return eventoRepository.findByOrganizadorId(idOrganizador)
                .stream().map(EventoMapper::toResponse).toList();
    }

    public List<EventoResponse> findByInstalacionId(Long idInstalacion) {
        return eventoRepository.findByInstalacionId(idInstalacion)
                .stream().map(EventoMapper::toResponse).toList();
    }

    public List<EventoResponse> findByTituloContaining(String titulo) {
        return eventoRepository.findByTituloContaining(titulo)
                .stream().map(EventoMapper::toResponse).toList();
    }

    public List<EventoResponse> findEventosFuturos(LocalDate fecha) {
        return eventoRepository.findEventosFuturos(fecha)
                .stream().map(EventoMapper::toResponse).toList();
    }

    // ------------------------- DELETE -------------------------
    public void deleteById(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new IllegalArgumentException("Evento no encontrado");
        }
        eventoRepository.deleteById(id);
    }

    // ------------------------- MÉTODOS AUXILIARES PRIVADOS
    // -------------------------
    private List<Instalacion> getInstalacionesByIds(List<Long> ids) {
        if (ids == null)
            return List.of();
        List<Instalacion> lista = new ArrayList<>();
        for (Long id : ids) {
            Instalacion inst = instalacionRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Instalación no encontrada: id=" + id));
            lista.add(inst);
        }
        return lista;
    }

    private List<Usuario> getUsuariosByIds(List<Long> ids) {
        if (ids == null)
            return List.of();
        List<Usuario> lista = new ArrayList<>();
        for (Long id : ids) {
            usuarioService.findEntityById(id).ifPresent(lista::add);
        }
        return lista;
    }

    private Evento save(Evento evento) {
        // ---------------- VALIDACIONES ----------------
        if (evento.getTitulo() == null || evento.getTitulo().isBlank())
            throw new IllegalArgumentException("El título es obligatorio");
        if (evento.getTipoEvento() == null)
            throw new IllegalArgumentException("El tipo de evento es obligatorio");
        if (evento.getFecha() == null)
            throw new IllegalArgumentException("La fecha es obligatoria (yyyy-MM-dd)");
        if (evento.getHoraInicio() == null)
            throw new IllegalArgumentException("La horaInicio es obligatoria (HH:mm:ss)");
        if (evento.getHoraFin() == null)
            throw new IllegalArgumentException("La horaFin es obligatoria (HH:mm:ss)");
        if (evento.getAvalPdf() == null || evento.getAvalPdf().isBlank())
            throw new IllegalArgumentException("La ruta del aval PDF es obligatoria");
        if (evento.getTipoAval() == null)
            throw new IllegalArgumentException("El tipoAval es obligatorio");
        if (evento.getOrganizador() == null || evento.getOrganizador().getIdUsuario() == null)
            throw new IllegalArgumentException("Debe indicar el organizador con su idUsuario");

        // Validar que sea estudiante o docente
        Long idOrg = evento.getOrganizador().getIdUsuario();
        boolean esEstudiante = estudianteRepository.findByUsuarioId(idOrg).isPresent();
        boolean esDocente = docenteRepository.findByUsuarioId(idOrg).isPresent();
        if (!esEstudiante && !esDocente)
            throw new IllegalArgumentException("Solo estudiantes o docentes pueden organizar eventos");

        // Fecha no puede ser en el pasado
        if (evento.getFecha().isBefore(LocalDate.now()))
            throw new IllegalArgumentException("La fecha del evento no puede ser en el pasado");

        return eventoRepository.save(evento);
    }

    private void manejarOrganizacionesExternas(Long idEvento, List<Long> organizacionesExternasIds) {
        // Eliminar participaciones existentes para este evento
        participacionOrganizacionRepository.deleteByIdEvento(idEvento);
        
        // Crear nuevas participaciones
        for (Long idOrganizacion : organizacionesExternasIds) {
            // Verificar que la organización existe
            if (!organizacionExternaRepository.existsById(idOrganizacion)) {
                throw new IllegalArgumentException("Organización externa no encontrada: id=" + idOrganizacion);
            }
            
            ParticipacionOrganizacion participacion = new ParticipacionOrganizacion();
            participacion.setIdEvento(idEvento);
            participacion.setIdOrganizacion(idOrganizacion);
            participacion.setCertificadoPdf("");
            participacion.setRepresentanteDiferente(false);
            
            participacionOrganizacionRepository.save(participacion);
        }
    }
}
