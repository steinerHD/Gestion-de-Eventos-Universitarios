package com.Geventos.GestionDeEventos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.Geventos.GestionDeEventos.serializer.TruncatedBase64Serializer;

import java.time.LocalDateTime;

@Entity
@Table(name = "evento_aval")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoAval {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aval")
    private Long idAval;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;
    
    @Column(name = "aval_pdf", nullable = false, columnDefinition = "bytea")
    @JdbcTypeCode(SqlTypes.BINARY)
    @JsonSerialize(using = TruncatedBase64Serializer.class)
    private byte[] avalPdf;
    
    @Convert(converter = TipoAvalConverter.class)
    @Column(name = "tipo_aval", nullable = false, length = 50)
    private TipoAval tipoAval;
    
    @Column(name = "nombre_aval", length = 150)
    private String nombreAval;
    
    @Column(name = "fecha_subida")
    private LocalDateTime fechaSubida = LocalDateTime.now();
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    public enum TipoAval {
        Director_Programa, Director_Docencia
    }
}
