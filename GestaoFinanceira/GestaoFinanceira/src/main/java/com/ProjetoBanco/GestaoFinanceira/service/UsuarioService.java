package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    Usuario criar(Usuario usuario);

    List<Usuario> procurarTodos();

    Optional <Usuario> procurarPorId(Integer id);

    Usuario atualizar (Usuario usuario);

    void deleteById(Integer id);
}
