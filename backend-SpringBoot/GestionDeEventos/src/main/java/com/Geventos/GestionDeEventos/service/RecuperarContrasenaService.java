package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.PasswordResetTokenRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
public class RecuperarContrasenaService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final MailService mailService;
    private final PasswordService passwordService;
    
    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    /**
     * Desencripta y envía la contraseña por correo
     */
    @Transactional
    public String enviarTokenRecuperacion(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .map(usuario -> {
                    System.out.println("Recuperando contraseña para: " + correo);
                    
                    try {
                        // Desencriptar la contraseña
                        String contrasenaDesencriptada = passwordService.decryptPassword(usuario.getContrasenaHash());
                        
                        // Enviar correo con la contraseña
                        String mensaje = String.format(
                            "Hola %s,\n\n" +
                            "Has solicitado recuperar tu contraseña.\n\n" +
                            "Tu contraseña es: %s\n\n" +
                            "Por seguridad, te recomendamos cambiarla después de iniciar sesión.\n\n" +
                            "Saludos,\n" +
                            "Sistema de Gestión de Eventos UAO",
                            usuario.getNombre(),
                            contrasenaDesencriptada
                        );
                        
                        mailService.enviarCorreo(
                                correo,
                                "Recuperación de contraseña - Gestión de Eventos UAO",
                                mensaje
                        );
                        
                        return "Contraseña enviada correctamente a " + correo;
                    } catch (Exception e) {
                        System.err.println("Error al desencriptar contraseña: " + e.getMessage());
                        return "Error al recuperar la contraseña";
                    }
                })
                .orElse("El correo no existe en la base de datos");
    }

    /**
     * Valida un token y restablece la contraseña
     */
    @Transactional
    public boolean restablecerContrasena(String token, String nuevaContrasena) {
        return tokenRepository.findByToken(token)
                .map(resetToken -> {
                    if (resetToken.isExpired()) {
                        System.out.println("Token expirado: " + token);
                        return false;
                    }
                    
                    if (resetToken.isUsed()) {
                        System.out.println("Token ya utilizado: " + token);
                        return false;
                    }
                    
                    // Actualizar la contraseña del usuario
                    Usuario usuario = resetToken.getUsuario();
                    usuario.setContrasenaHash(nuevaContrasena); // Se encriptará en UsuarioService
                    usuarioRepository.save(usuario);
                    
                    // Marcar token como usado
                    resetToken.setUsed(true);
                    tokenRepository.save(resetToken);
                    
                    System.out.println("Contraseña restablecida para usuario: " + usuario.getCorreo());
                    return true;
                })
                .orElse(false);
    }

    /**
     * Valida si un token es válido
     */
    public boolean validarToken(String token) {
        return tokenRepository.findByToken(token)
                .map(resetToken -> !resetToken.isExpired() && !resetToken.isUsed())
                .orElse(false);
    }
}
