package com.Geventos.GestionDeEventos.entity;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.util.Base64;

public class TruncatedBase64Serializer extends JsonSerializer<byte[]> {

    private static final int MAX_CHARS = 60; // tamaño máximo a mostrar en respuestas

    @Override
    public void serialize(byte[] value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }
        String base64 = Base64.getEncoder().encodeToString(value);
        if (base64.length() <= MAX_CHARS) {
            gen.writeString(base64);
        } else {
            String truncated = base64.substring(0, MAX_CHARS) + "...";
            gen.writeString(truncated);
        }
    }
}


