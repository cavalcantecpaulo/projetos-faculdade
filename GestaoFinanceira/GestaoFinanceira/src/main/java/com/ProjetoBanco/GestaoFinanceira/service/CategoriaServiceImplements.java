package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.Categoria;
import com.ProjetoBanco.GestaoFinanceira.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImplements implements CategoriaService{
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public Categoria salvar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public List<Categoria> procurarTodos() {
        return categoriaRepository.findAll();
    }

    @Override
    public Optional<Categoria> procurarPorId(Integer id) {
        return categoriaRepository.findById(id);
    }

    @Override
    public Categoria atualizar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public void deleteById(Integer id) {
        categoriaRepository.deleteById(id);
    }
}
