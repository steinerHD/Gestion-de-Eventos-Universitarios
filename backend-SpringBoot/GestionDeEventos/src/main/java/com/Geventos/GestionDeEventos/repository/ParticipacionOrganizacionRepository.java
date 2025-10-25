package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacion;
import com.Geventos.GestionDeEventos.entity.ParticipacionOrganizacionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipacionOrganizacionRepository extends JpaRepository<ParticipacionOrganizacion, ParticipacionOrganizacionId> {
    
    @Query("SELECT p FROM ParticipacionOrganizacion p WHERE p.idEvento = :idEvento")
    List<ParticipacionOrganizacion> findByEventoId(@Param("idEvento") Long idEvento);
    
    @Query("SELECT p FROM ParticipacionOrganizacion p WHERE p.idOrganizacion = :idOrganizacion")
    List<ParticipacionOrganizacion> findByOrganizacionId(@Param("idOrganizacion") Long idOrganizacion);
    
    @Query("SELECT p FROM ParticipacionOrganizacion p WHERE p.representanteDiferente = true")
    List<ParticipacionOrganizacion> findByRepresentanteDiferenteTrue();
    
    @Modifying
    @Query("DELETE FROM ParticipacionOrganizacion p WHERE p.idEvento = :idEvento")
    void deleteByIdEvento(@Param("idEvento") Long idEvento);
}

