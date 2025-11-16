package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SecretariaAcademicaRepository extends JpaRepository<SecretariaAcademica, Long> {
    
    @Query("SELECT s FROM SecretariaAcademica s WHERE s.usuario.idUsuario = :idUsuario")
    Optional<SecretariaAcademica> findByUsuarioId(@Param("idUsuario") Long idUsuario);
    
    List<SecretariaAcademica> findByFacultad(String facultad);
    
    List<SecretariaAcademica> findByFacultadAndActiva(String facultad, Boolean activa);
    
    Optional<SecretariaAcademica> findByFacultadAndActivaTrue(String facultad);
}
