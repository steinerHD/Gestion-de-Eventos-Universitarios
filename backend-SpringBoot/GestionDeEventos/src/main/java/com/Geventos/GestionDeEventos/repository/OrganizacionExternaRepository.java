package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.OrganizacionExterna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizacionExternaRepository extends JpaRepository<OrganizacionExterna, Long> {
    
    List<OrganizacionExterna> findBySectorEconomico(String sectorEconomico);
    
    @Query("SELECT o FROM OrganizacionExterna o WHERE o.nombre LIKE %:nombre%")
    List<OrganizacionExterna> findByNombreContaining(@Param("nombre") String nombre);
    
    @Query("SELECT o FROM OrganizacionExterna o WHERE o.representanteLegal LIKE %:representante%")
    List<OrganizacionExterna> findByRepresentanteLegalContaining(@Param("representante") String representante);
    
    @Query("SELECT o FROM OrganizacionExterna o WHERE o.ubicacion LIKE %:ubicacion%")
    List<OrganizacionExterna> findByUbicacionContaining(@Param("ubicacion") String ubicacion);
}
