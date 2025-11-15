package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.EventoOrganizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoOrganizadorRepository extends JpaRepository<EventoOrganizador, Long> {
    List<EventoOrganizador> findByEventoId(Long idEvento);
    void deleteByEventoId(Long idEvento);
}
