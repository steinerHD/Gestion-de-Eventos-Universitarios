package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class TipoAvalConverter implements AttributeConverter<Evento.TipoAval, String> {

    @Override
    public String convertToDatabaseColumn(Evento.TipoAval attribute) {
        if (attribute == null) {
            return null;
        }
        return switch (attribute) {
            case Director_Programa -> "Director Programa";
            case Director_Docencia -> "Director Docencia";
        };
    }

    @Override
    public Evento.TipoAval convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return switch (dbData) {
            case "Director Programa" -> Evento.TipoAval.Director_Programa;
            case "Director Docencia" -> Evento.TipoAval.Director_Docencia;
            default -> throw new IllegalArgumentException("TipoAval desconocido: " + dbData);
        };
    }
}


