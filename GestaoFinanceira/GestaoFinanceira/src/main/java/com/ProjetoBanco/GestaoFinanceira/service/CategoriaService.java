package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.Categoria;

import java.util.List;
import java.util.Optional;

public interface CategoriaService {

    Categoria salvar (Categoria categoria);

    List<Categoria> procurarTodos();

    Optional<Categoria> procurarPorId(Integer id);

    Categoria atualizar (Categoria categoria);

    void deleteById(Integer id);
}
