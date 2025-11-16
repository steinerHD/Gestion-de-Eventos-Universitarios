package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.EventoOrganizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EventoOrganizadorRepository extends JpaRepository<EventoOrganizador, Long> {
    List<EventoOrganizador> findByEvento_IdEvento(Long idEvento);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM EventoOrganizador eo WHERE eo.evento.idEvento = :idEvento")
    void deleteByEvento_IdEvento(@Param("idEvento") Long idEvento);
}
