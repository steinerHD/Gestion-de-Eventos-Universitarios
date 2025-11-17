package com.Geventos.GestionDeEventos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * Servicio para manejar la encriptación y desencriptación de contraseñas usando AES.
 * Permite encriptar para guardar en BD y desencriptar para recuperación de contraseña.
 */
@Service
public class PasswordService {

    private static final String ALGORITHM = "AES";
    private final SecretKey secretKey;

    public PasswordService(@Value("${password.encryption.key:MySecretKey12345}") String encryptionKey) {
        // Asegurar que la clave tenga exactamente 16 bytes (128 bits)
        String key = encryptionKey;
        if (key.length() < 16) {
            key = String.format("%-16s", key).replace(' ', '0');
        } else if (key.length() > 16) {
            key = key.substring(0, 16);
        }
        this.secretKey = new SecretKeySpec(key.getBytes(), ALGORITHM);
    }

    /**
     * Encripta una contraseña en texto plano usando AES.
     * 
     * @param rawPassword La contraseña en texto plano
     * @return La contraseña encriptada en Base64
     */
    public String encryptPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }
        
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(rawPassword.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error al encriptar la contraseña", e);
        }
    }

    /**
     * Desencripta una contraseña encriptada a texto plano.
     * 
     * @param encryptedPassword La contraseña encriptada en Base64
     * @return La contraseña en texto plano
     */
    public String decryptPassword(String encryptedPassword) {
        if (encryptedPassword == null || encryptedPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña encriptada no puede estar vacía");
        }
        
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
            return new String(decryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error al desencriptar la contraseña", e);
        }
    }

    /**
     * Verifica si una contraseña en texto plano coincide con una contraseña encriptada.
     * 
     * @param rawPassword La contraseña en texto plano a verificar
     * @param encryptedPassword La contraseña encriptada almacenada
     * @return true si la contraseña coincide, false en caso contrario
     */
    public boolean verifyPassword(String rawPassword, String encryptedPassword) {
        if (rawPassword == null || encryptedPassword == null) {
            return false;
        }
        
        try {
            String decrypted = decryptPassword(encryptedPassword);
            return rawPassword.equals(decrypted);
        } catch (Exception e) {
            return false;
        }
    }
}
