package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.Usuario;
import com.ProjetoBanco.GestaoFinanceira.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImplements implements UsuarioService{
    @Autowired
    private UsuarioRepository usuariorepository;

    @Override
    public Usuario criar(Usuario usuario){
        return usuariorepository.save(usuario);
    }

    @Override
    public List<Usuario> procurarTodos(){
        return usuariorepository.findAll();
    }
    @Override
    public Optional<Usuario> procurarPorId(Integer id) {
        return usuariorepository.findById(id);
    }

    @Override
    public Usuario atualizar(Usuario usuario) {
        return usuariorepository.save(usuario);
    }

    @Override
    public void deleteById(Integer id) {
        usuariorepository.deleteById(id);
    }
}
