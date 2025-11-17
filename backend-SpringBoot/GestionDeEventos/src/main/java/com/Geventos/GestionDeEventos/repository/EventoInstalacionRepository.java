package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.EventoInstalacion;
import com.Geventos.GestionDeEventos.entity.EventoInstalacionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface EventoInstalacionRepository extends JpaRepository<EventoInstalacion, EventoInstalacionId> {
    
    @Query("SELECT ei FROM EventoInstalacion ei WHERE ei.id.idEvento = :idEvento")
    List<EventoInstalacion> findByEventoId(@Param("idEvento") Long idEvento);
    
    void deleteByIdIdEvento(Long idEvento);
    
    /**
     * Verifica si existe un conflicto de horario para una instalación en una fecha específica
     */
    @Query("SELECT COUNT(ei) > 0 FROM EventoInstalacion ei " +
           "WHERE ei.instalacion.idInstalacion = :idInstalacion " +
           "AND ei.evento.fecha = :fecha " +
           "AND ei.evento.idEvento != :idEventoExcluir " +
           "AND NOT (ei.horaFin <= :horaInicio OR ei.horaInicio >= :horaFin)")
    boolean existeConflictoHorario(
        @Param("idInstalacion") Long idInstalacion,
        @Param("fecha") LocalDate fecha,
        @Param("horaInicio") LocalTime horaInicio,
        @Param("horaFin") LocalTime horaFin,
        @Param("idEventoExcluir") Long idEventoExcluir
    );
}
