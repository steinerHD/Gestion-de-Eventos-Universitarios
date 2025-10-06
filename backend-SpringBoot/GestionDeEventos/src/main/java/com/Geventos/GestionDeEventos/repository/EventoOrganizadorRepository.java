package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.EventoOrganizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoOrganizadorRepository extends JpaRepository<EventoOrganizador, EventoOrganizador.EventoOrganizadorId> {
    
    @Query("SELECT eo FROM EventoOrganizador eo WHERE eo.id.idEvento = :idEvento")
    List<EventoOrganizador> findByEventoId(@Param("idEvento") Long idEvento);
    
    @Query("SELECT eo FROM EventoOrganizador eo WHERE eo.id.idUsuario = :idUsuario")
    List<EventoOrganizador> findByUsuarioId(@Param("idUsuario") Long idUsuario);
    
    @Query("SELECT eo FROM EventoOrganizador eo WHERE eo.id.idEvento = :idEvento AND eo.rolOrganizador = :rol")
    List<EventoOrganizador> findByEventoIdAndRol(@Param("idEvento") Long idEvento, @Param("rol") String rol);
    
    void deleteById_IdEventoAndId_IdUsuario(Long idEvento, Long idUsuario);
}
