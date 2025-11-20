package com.Geventos.GestionDeEventos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@SuppressWarnings("null")
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${aval.upload.path:uploads/avales}")
    private String avalUploadDirProperty;

    @Value("${acta.upload.path:uploads/actas}")
    private String actaUploadDirProperty;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path avalDir = Paths.get(avalUploadDirProperty);
        String avalPath = avalDir.toFile().getAbsolutePath() + "/";
        registry.addResourceHandler("/assets/uploads/avales/**")
                .addResourceLocations("file:" + avalPath)
                .setCachePeriod(3600);

        Path actaDir = Paths.get(actaUploadDirProperty);
        String actaPath = actaDir.toFile().getAbsolutePath() + "/";
        registry.addResourceHandler("/assets/uploads/actas/**")
                .addResourceLocations("file:" + actaPath)
                .setCachePeriod(3600);
    }
}
