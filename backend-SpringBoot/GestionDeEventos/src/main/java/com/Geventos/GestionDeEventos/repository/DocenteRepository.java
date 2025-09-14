package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    
    @Query("SELECT d FROM Docente d WHERE d.usuario.idUsuario = :idUsuario")
    Optional<Docente> findByUsuarioId(@Param("idUsuario") Long idUsuario);
    
    List<Docente> findByUnidadAcademica(String unidadAcademica);
    
    List<Docente> findByCargo(String cargo);
}
