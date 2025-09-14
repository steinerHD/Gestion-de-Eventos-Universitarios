package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    
    Optional<Estudiante> findByCodigoEstudiantil(String codigoEstudiantil);
    
    boolean existsByCodigoEstudiantil(String codigoEstudiantil);
    
    @Query("SELECT e FROM Estudiante e WHERE e.usuario.idUsuario = :idUsuario")
    Optional<Estudiante> findByUsuarioId(@Param("idUsuario") Long idUsuario);
}
