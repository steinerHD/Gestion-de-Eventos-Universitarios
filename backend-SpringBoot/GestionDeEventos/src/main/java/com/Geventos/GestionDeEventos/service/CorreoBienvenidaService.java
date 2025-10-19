package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CorreoBienvenidaService {

    private final MailService mailService;

    public void enviarCorreoBienvenida(Usuario usuario) {
        String asunto = "Bienvenido a SIGEU 🎉";
        String cuerpo = String.format("""
                Hola %s,

                ¡Gracias por registrarte en SIGEU! 🎊

                Tu cuenta ha sido creada exitosamente con el correo: %s

                A partir de ahora podrás acceder a nuestra plataforma y participar en los eventos y gestiones del sistema SIGEU.

                Si no reconoces este registro, por favor comunícate con nuestro equipo de soporte.

                Saludos,  
                El equipo de SIGEU
                """, usuario.getNombre(), usuario.getCorreo());

        mailService.enviarCorreo(usuario.getCorreo(), asunto, cuerpo);
    }
}
