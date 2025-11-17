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
    
    @Query("SELECT n FROM Notificacion n WHERE n.usuario.idUsuario = :idUsuario ORDER BY n.fechaEnvio DESC")
    List<Notificacion> findByUsuarioId(@Param("idUsuario") Long idUsuario);
    
    @Query("SELECT n FROM Notificacion n WHERE n.usuario.idUsuario = :idUsuario AND n.leida = false ORDER BY n.fechaEnvio DESC")
    List<Notificacion> findByUsuarioIdAndNoLeidas(@Param("idUsuario") Long idUsuario);
    
    List<Notificacion> findByFechaEnvioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    @Query("SELECT n FROM Notificacion n WHERE n.fechaEnvio >= :fecha")
    List<Notificacion> findNotificacionesRecientes(@Param("fecha") LocalDateTime fecha);
}
