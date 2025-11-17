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
    private String uploadDirProperty;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(uploadDirProperty);
        String uploadPath = uploadDir.toFile().getAbsolutePath() + "/";
        registry.addResourceHandler("/assets/uploads/avales/**")
                .addResourceLocations("file:" + uploadPath)
                .setCachePeriod(3600);
    }
}
