package com.Geventos.GestionDeEventos.util;

import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import com.Geventos.GestionDeEventos.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Migración única para encriptar contraseñas existentes en texto plano.
 * Solo ejecutar una vez después de implementar BCrypt.
 * 
 * IMPORTANTE: Este componente está deshabilitado por defecto.
 * Para ejecutarlo, iniciar la aplicación con el profile: -Dspring.profiles.active=migrate-passwords
 */
@Component
@Profile("migrate-passwords")
@RequiredArgsConstructor
public class PasswordMigrationRunner implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("==============================================");
        System.out.println("INICIANDO MIGRACIÓN DE CONTRASEÑAS A BCRYPT");
        System.out.println("==============================================");

        List<Usuario> usuarios = usuarioRepository.findAll();
        int migrated = 0;
        int skipped = 0;

        for (Usuario usuario : usuarios) {
            String currentHash = usuario.getContrasenaHash();
            
            // Verificar si ya está encriptado con BCrypt (los hashes BCrypt empiezan con $2a$, $2b$ o $2y$)
            if (currentHash != null && currentHash.startsWith("$2")) {
                System.out.println("⏭️  Usuario " + usuario.getCorreo() + " ya está encriptado. Omitiendo...");
                skipped++;
                continue;
            }

            try {
                // Asumir que currentHash es la contraseña en texto plano
                String encryptedPassword = passwordService.encryptPassword(currentHash);
                usuario.setContrasenaHash(encryptedPassword);
                usuarioRepository.save(usuario);
                
                System.out.println("✅ Usuario " + usuario.getCorreo() + " migrado exitosamente");
                migrated++;
            } catch (Exception e) {
                System.err.println("❌ Error migrando usuario " + usuario.getCorreo() + ": " + e.getMessage());
            }
        }

        System.out.println("==============================================");
        System.out.println("MIGRACIÓN COMPLETADA");
        System.out.println("Usuarios migrados: " + migrated);
        System.out.println("Usuarios omitidos (ya encriptados): " + skipped);
        System.out.println("Total: " + usuarios.size());
        System.out.println("==============================================");
        System.out.println("IMPORTANTE: Desactivar el profile 'migrate-passwords' antes del próximo inicio");
    }
}
