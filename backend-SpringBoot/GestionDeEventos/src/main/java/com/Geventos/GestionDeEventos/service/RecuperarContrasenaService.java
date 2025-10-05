package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecuperarContrasenaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MailService mailService;

    public String enviarContrasena(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .map(usuario -> {
                    System.out.println("Buscando correo: " + correo);
                    String contrasena = usuario.getContrasenaHash();
                    mailService.enviarCorreo(
                            correo,
                            "Recuperación de contraseña",
                            "Tu contraseña registrada es: " + contrasena
                    );
                    return "Correo enviado correctamente a " + correo;
                })
                .orElse("El correo no existe en la base de datos");
    }
}
