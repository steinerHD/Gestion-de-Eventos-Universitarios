package com.Geventos.GestionDeEventos.service;

import com.Geventos.GestionDeEventos.entity.Docente;
import com.Geventos.GestionDeEventos.entity.Usuario;
import com.Geventos.GestionDeEventos.repository.DocenteRepository;
import com.Geventos.GestionDeEventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DocenteService {
    
    private final DocenteRepository docenteRepository;
    private final UsuarioRepository usuarioRepository;
    
    public List<Docente> findAll() {
        return docenteRepository.findAll();
    }
    
    public Optional<Docente> findById(Long id) {
        return docenteRepository.findById(id);
    }
    
    public Optional<Docente> findByUsuarioId(Long idUsuario) {
        return docenteRepository.findByUsuarioId(idUsuario);
    }
    
    public List<Docente> findByUnidadAcademica(String unidadAcademica) {
        return docenteRepository.findByUnidadAcademica(unidadAcademica);
    }
    
    public List<Docente> findByCargo(String cargo) {
        return docenteRepository.findByCargo(cargo);
    }
    
    public Docente save(Docente docente) {
        // Validar que el usuario exista
        Usuario usuario = usuarioRepository.findById(docente.getIdDocente())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        // Validar que el usuario no sea ya estudiante, docente o secretaria
        if (docenteRepository.findByUsuarioId(docente.getIdDocente()).isPresent()) {
            throw new IllegalArgumentException("El usuario ya es un docente");
        }
        
        docente.setUsuario(usuario);
        return docenteRepository.save(docente);
    }
    
    public Docente update(Long id, Docente docente) {
        Docente existingDocente = docenteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Docente no encontrado"));
        
        existingDocente.setUnidadAcademica(docente.getUnidadAcademica());
        existingDocente.setCargo(docente.getCargo());
        
        return docenteRepository.save(existingDocente);
    }
    
    public void deleteById(Long id) {
        if (!docenteRepository.existsById(id)) {
            throw new IllegalArgumentException("Docente no encontrado");
        }
        docenteRepository.deleteById(id);
    }
}
