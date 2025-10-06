package com.Geventos.GestionDeEventos.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class ParticipacionOrganizacionId implements Serializable {
    private Long idEvento;
    private Long idOrganizacion;

    public ParticipacionOrganizacionId() {}

    public ParticipacionOrganizacionId(Long idEvento, Long idOrganizacion) {
        this.idEvento = idEvento;
        this.idOrganizacion = idOrganizacion;
    }
    
   
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParticipacionOrganizacionId)) return false;
        ParticipacionOrganizacionId that = (ParticipacionOrganizacionId) o;
        return idEvento.equals(that.idEvento) && idOrganizacion.equals(that.idOrganizacion);
    }
    
    @Override
    public int hashCode() {
        return idEvento.hashCode() + idOrganizacion.hashCode();
    }
}
