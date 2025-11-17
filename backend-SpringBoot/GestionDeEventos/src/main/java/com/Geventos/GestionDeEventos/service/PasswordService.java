package com.Geventos.GestionDeEventos.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Servicio para manejar la encriptación y verificación de contraseñas usando BCrypt.
 * BCrypt es un algoritmo de hash seguro que incluye salt automático y es resistente a ataques de fuerza bruta.
 */
@Service
public class PasswordService {

    private final BCryptPasswordEncoder passwordEncoder;

    public PasswordService() {
        // Strength 12 ofrece un buen balance entre seguridad y rendimiento
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

    /**
     * Encripta una contraseña en texto plano usando BCrypt.
     * 
     * @param rawPassword La contraseña en texto plano
     * @return La contraseña encriptada (hash)
     */
    public String encryptPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * Verifica si una contraseña en texto plano coincide con un hash BCrypt.
     * 
     * @param rawPassword La contraseña en texto plano a verificar
     * @param encodedPassword El hash de la contraseña almacenado
     * @return true si la contraseña coincide, false en caso contrario
     */
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * Verifica si un hash necesita ser actualizado (por ejemplo, si se cambió el strength).
     * 
     * @param encodedPassword El hash a verificar
     * @return true si el hash necesita ser re-encriptado
     */
    public boolean needsUpgrade(String encodedPassword) {
        return passwordEncoder.upgradeEncoding(encodedPassword);
    }
}
