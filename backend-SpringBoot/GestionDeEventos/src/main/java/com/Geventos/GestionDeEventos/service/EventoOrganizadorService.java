package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.EventoOrganizador;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.EventoOrganizadorRepository;
import com.Geventos.GestionDeEventos.repository.EventoRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventoOrganizadorService {
    
    private final EventoOrganizadorRepository eventoOrganizadorRepository;
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    
    public List<EventoOrganizador> getOrganizadoresByEventoId(Long idEvento) {
        return eventoOrganizadorRepository.findByEventoId(idEvento);
    }
    
    public List<EventoOrganizador> getEventosByUsuarioId(Long idUsuario) {
        return eventoOrganizadorRepository.findByUsuarioId(idUsuario);
    }
    
    @Transactional
    public EventoOrganizador addOrganizadorToEvento(Long idEvento, Long idUsuario, String rolOrganizador) {
        // Verificar que el evento existe
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));
        
        // Verificar que el usuario existe
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        // Verificar que no sea ya organizador
        Optional<EventoOrganizador> existing = eventoOrganizadorRepository.findById(
                new EventoOrganizador.EventoOrganizadorId(idEvento, idUsuario));
        if (existing.isPresent()) {
            throw new IllegalArgumentException("El usuario ya es organizador de este evento");
        }
        
        // Crear nueva relación
        EventoOrganizador eventoOrganizador = new EventoOrganizador();
        eventoOrganizador.setId(new EventoOrganizador.EventoOrganizadorId(idEvento, idUsuario));
        eventoOrganizador.setEvento(evento);
        eventoOrganizador.setUsuario(usuario);
        eventoOrganizador.setRolOrganizador(rolOrganizador != null ? rolOrganizador : "Organizador");
        
        return eventoOrganizadorRepository.save(eventoOrganizador);
    }
    
    @Transactional
    public void removeOrganizadorFromEvento(Long idEvento, Long idUsuario) {
        eventoOrganizadorRepository.deleteById_IdEventoAndId_IdUsuario(idEvento, idUsuario);
    }
    
    @Transactional
    public EventoOrganizador updateRolOrganizador(Long idEvento, Long idUsuario, String nuevoRol) {
        EventoOrganizador eventoOrganizador = eventoOrganizadorRepository.findById(
                new EventoOrganizador.EventoOrganizadorId(idEvento, idUsuario))
                .orElseThrow(() -> new IllegalArgumentException("Relación organizador-evento no encontrada"));
        
        eventoOrganizador.setRolOrganizador(nuevoRol);
        return eventoOrganizadorRepository.save(eventoOrganizador);
    }
}
