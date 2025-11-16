package com.Geventos.GestionDeEventos.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class FileUploadController {

    // Path on the filesystem where files will be stored. Can be configured in application.properties
    @Value("${aval.upload.path:uploads/avales}")
    private String avalUploadDirProperty;

    @Value("${acta.upload.path:uploads/actas}")
    private String actaUploadDirProperty;

    // URL prefix stored in DB (keeps frontend expectations)
    private static final String AVAL_URL_PREFIX = "assets/uploads/avales";
    private static final String ACTA_URL_PREFIX = "assets/uploads/actas";

    @PostMapping("/api/avales")
    public ResponseEntity<Map<String, String>> uploadAval(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, avalUploadDirProperty, AVAL_URL_PREFIX, "Aval");
    }

    @PostMapping("/api/actas")
    public ResponseEntity<Map<String, String>> uploadActa(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, actaUploadDirProperty, ACTA_URL_PREFIX, "Acta");
    }

    private ResponseEntity<Map<String, String>> uploadFile(
            MultipartFile file, 
            String uploadDirProperty, 
            String urlPrefix,
            String fileType) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
            }

            // Resolve upload directory from configured property
            Path uploadPath = Paths.get(uploadDirProperty);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid filename"));
            }
            originalFilename = StringUtils.cleanPath(originalFilename);
            String timestamp = String.valueOf(Instant.now().toEpochMilli());
            String filename = timestamp + "_" + originalFilename;

            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target);

            String storedPath = urlPrefix + "/" + filename;

            System.out.println("[DEBUG] " + fileType + " guardado en filesystem: " + target.toAbsolutePath());

            Map<String, String> resp = new HashMap<>();
            resp.put("path", storedPath);
            resp.put("filename", filename);

            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
