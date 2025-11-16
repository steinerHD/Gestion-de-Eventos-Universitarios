package com.Geventos.GestionDeEventos.repository;

import com.Geventos.GestionDeEventos.entity.Evento;
import com.Geventos.GestionDeEventos.entity.EventoSecretaria;
import com.Geventos.GestionDeEventos.entity.SecretariaAcademica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoSecretariaRepository extends JpaRepository<EventoSecretaria, Long> {
    
    List<EventoSecretaria> findBySecretaria(SecretariaAcademica secretaria);
    
    @Query("SELECT es.evento FROM EventoSecretaria es WHERE es.secretaria.idSecretaria = :idSecretaria")
    List<Evento> findEventosBySecretariaId(@Param("idSecretaria") Long idSecretaria);
    
    boolean existsByEventoAndSecretaria(Evento evento, SecretariaAcademica secretaria);
}
