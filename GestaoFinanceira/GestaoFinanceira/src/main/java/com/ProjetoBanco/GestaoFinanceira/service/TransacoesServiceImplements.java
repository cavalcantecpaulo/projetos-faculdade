package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.Categoria;
import com.ProjetoBanco.GestaoFinanceira.model.Transacoes;
import com.ProjetoBanco.GestaoFinanceira.repository.TransacoesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransacoesServiceImplements implements TransacoesService{

    @Autowired
    private TransacoesRepository transacoesRepository;

    @Override
    public Transacoes salvar(Transacoes transacoes) {
        return transacoesRepository.save(transacoes);
    }

    @Override
    public List<Transacoes> procurarTodos() {
        return transacoesRepository.findAll();
    }

    @Override
    public Optional<Transacoes> procurarPorId(Integer id) {
        return transacoesRepository.findById(id);
    }

    @Override
    public Transacoes atualizar(Transacoes transacoes) {
        return transacoesRepository.save(transacoes);
    }

    @Override
    public void deleteById(Integer id) {
        transacoesRepository.deleteById(id);
    }
}
