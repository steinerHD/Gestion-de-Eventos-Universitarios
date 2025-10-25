package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    
    List<Evento> findByTipoEvento(Evento.TipoEvento tipoEvento);
    
    List<Evento> findByFecha(LocalDate fecha);
    
    List<Evento> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    
    @Query("SELECT e FROM Evento e WHERE e.organizador.idUsuario = :idOrganizador")
    List<Evento> findByOrganizadorId(@Param("idOrganizador") Long idOrganizador);
    
    @Query("SELECT e FROM Evento e JOIN e.instalaciones i WHERE i.idInstalacion = :idInstalacion")
    List<Evento> findByInstalacionId(@Param("idInstalacion") Long idInstalacion);
    
    @Query("SELECT e FROM Evento e WHERE e.titulo LIKE %:titulo%")
    List<Evento> findByTituloContaining(@Param("titulo") String titulo);
    
    @Query("SELECT e FROM Evento e WHERE e.fecha >= :fecha")
    List<Evento> findEventosFuturos(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT DISTINCT e FROM Evento e " +
           "LEFT JOIN FETCH e.participacionesOrganizaciones p " +
           "LEFT JOIN FETCH p.organizacion " +
           "WHERE e.idEvento = :id")
    java.util.Optional<Evento> findByIdWithParticipaciones(@Param("id") Long id);
    
    @Query("SELECT DISTINCT e FROM Evento e " +
           "LEFT JOIN FETCH e.participacionesOrganizaciones p " +
           "LEFT JOIN FETCH p.organizacion")
    List<Evento> findAllWithParticipaciones();
}
