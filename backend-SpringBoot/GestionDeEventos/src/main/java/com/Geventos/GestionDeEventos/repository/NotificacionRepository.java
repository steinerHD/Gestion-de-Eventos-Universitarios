package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    
    @Query("SELECT n FROM Notificacion n WHERE n.evaluacion.idEvaluacion = :idEvaluacion")
    List<Notificacion> findByEvaluacionId(@Param("idEvaluacion") Long idEvaluacion);
    
    List<Notificacion> findByFechaEnvioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    @Query("SELECT n FROM Notificacion n WHERE n.fechaEnvio >= :fecha")
    List<Notificacion> findNotificacionesRecientes(@Param("fecha") LocalDateTime fecha);
}
