package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    
    List<Evaluacion> findByEstado(Evaluacion.EstadoEvaluacion estado);
    
    @Query("SELECT e FROM Evaluacion e WHERE e.evento.idEvento = :idEvento")
    List<Evaluacion> findByEventoId(@Param("idEvento") Long idEvento);
    
    @Query("SELECT e FROM Evaluacion e WHERE e.secretaria.idSecretaria = :idSecretaria")
    List<Evaluacion> findBySecretariaId(@Param("idSecretaria") Long idSecretaria);
    
    List<Evaluacion> findByFecha(LocalDate fecha);
    
    List<Evaluacion> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    
    @Query("SELECT e FROM Evaluacion e WHERE e.estado = 'Pendiente'")
    List<Evaluacion> findEvaluacionesPendientes();
}
