package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.EventoAval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoAvalRepository extends JpaRepository<EventoAval, Long> {
    
    @Query("SELECT ea FROM EventoAval ea WHERE ea.evento.idEvento = :idEvento AND ea.activo = true")
    List<EventoAval> findByEventoIdAndActivo(@Param("idEvento") Long idEvento);
    
    @Query("SELECT ea FROM EventoAval ea WHERE ea.evento.idEvento = :idEvento")
    List<EventoAval> findByEventoId(@Param("idEvento") Long idEvento);
    
    @Query("SELECT ea FROM EventoAval ea WHERE ea.evento.idEvento = :idEvento AND ea.tipoAval = :tipoAval AND ea.activo = true")
    List<EventoAval> findByEventoIdAndTipoAval(@Param("idEvento") Long idEvento, @Param("tipoAval") EventoAval.TipoAval tipoAval);
    
    @Query("SELECT ea FROM EventoAval ea WHERE ea.activo = true")
    List<EventoAval> findAllActivos();
}
