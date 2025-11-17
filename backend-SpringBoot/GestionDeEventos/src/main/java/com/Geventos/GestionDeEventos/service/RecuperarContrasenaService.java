package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.PasswordResetToken;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.PasswordResetTokenRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecuperarContrasenaService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final MailService mailService;
    
    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    /**
     * Genera un token de recuperación y envía el correo con el enlace
     */
    @Transactional
    public String enviarTokenRecuperacion(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .map(usuario -> {
                    System.out.println("Generando token de recuperación para: " + correo);
                    
                    // Eliminar tokens anteriores del usuario
                    tokenRepository.deleteByUsuario(usuario);
                    
                    // Generar nuevo token
                    String token = UUID.randomUUID().toString();
                    PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
                    tokenRepository.save(resetToken);
                    
                    // Construir enlace de recuperación
                    String resetLink = frontendUrl + "/reset-password?token=" + token;
                    
                    // Enviar correo con el enlace
                    String mensaje = String.format(
                        "Hola %s,\n\n" +
                        "Has solicitado recuperar tu contraseña.\n\n" +
                        "Haz clic en el siguiente enlace para restablecer tu contraseña:\n" +
                        "%s\n\n" +
                        "Este enlace es válido por 1 hora.\n\n" +
                        "Si no solicitaste este cambio, ignora este correo.\n\n" +
                        "Saludos,\n" +
                        "Sistema de Gestión de Eventos UAO",
                        usuario.getNombre(),
                        resetLink
                    );
                    
                    mailService.enviarCorreo(
                            correo,
                            "Recuperación de contraseña - Gestión de Eventos UAO",
                            mensaje
                    );
                    
                    return "Correo de recuperación enviado correctamente a " + correo;
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
