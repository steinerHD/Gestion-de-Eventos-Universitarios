package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.PeriodoActivacion;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PeriodoActivacionRepository extends JpaRepository<PeriodoActivacion, Long> {
    
    List<PeriodoActivacion> findBySecretariaOrderByFechaInicioDesc(SecretariaAcademica secretaria);
    
    Optional<PeriodoActivacion> findBySecretariaAndFechaFinIsNull(SecretariaAcademica secretaria);
    
    @Query("SELECT p FROM PeriodoActivacion p WHERE p.secretaria = :secretaria " +
           "AND :fecha >= p.fechaInicio " +
           "AND (p.fechaFin IS NULL OR :fecha <= p.fechaFin)")
    Optional<PeriodoActivacion> findPeriodoActivoEnFecha(
            @Param("secretaria") SecretariaAcademica secretaria,
            @Param("fecha") LocalDateTime fecha);
}
