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
@RequestMapping("/api/avales")
@CrossOrigin(origins = "*")
public class FileUploadController {

    // Path on the filesystem where files will be stored. Can be configured in application.properties
    // Example values (absolute recommended):
    // aval.upload.path=C:/Projects/planicash/.../frontend-Angular/AngularFrontEnd/src/assets/uploads/avales
    // aval.upload.path=uploads/avales
    @Value("${aval.upload.path:uploads/avales}")
    private String uploadDirProperty;

    // URL prefix stored in DB (keeps frontend expectations)
    private static final String URL_PREFIX = "assets/uploads/avales";

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> uploadAval(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
            }

            // Resolve upload directory from configured property
            Path uploadPath = Paths.get(uploadDirProperty);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String timestamp = String.valueOf(Instant.now().toEpochMilli());
            String filename = timestamp + "_" + originalFilename;

            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target);

            String storedPath = URL_PREFIX + "/" + filename; // e.g. assets/uploads/avales/123_file.pdf

            System.out.println("[DEBUG] Aval guardado en filesystem: " + target.toAbsolutePath());

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
