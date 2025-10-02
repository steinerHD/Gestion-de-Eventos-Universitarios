package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.Instalacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstalacionRepository extends JpaRepository<Instalacion, Long> {
    
    List<Instalacion> findByTipo(String tipo);
    
    List<Instalacion> findByCapacidadGreaterThanEqual(Integer capacidad);
    
    @Query("SELECT i FROM Instalacion i WHERE i.nombre LIKE %:nombre%")
    List<Instalacion> findByNombreContaining(@Param("nombre") String nombre);
    
    @Query("SELECT i FROM Instalacion i WHERE i.ubicacion LIKE %:ubicacion%")
    List<Instalacion> findByUbicacionContaining(@Param("ubicacion") String ubicacion);
}
