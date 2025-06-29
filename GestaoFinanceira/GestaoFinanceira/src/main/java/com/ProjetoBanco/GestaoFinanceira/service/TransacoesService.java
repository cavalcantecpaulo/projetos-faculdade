package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.Transacoes;

import java.util.List;
import java.util.Optional;

public interface TransacoesService {
    Transacoes salvar (Transacoes transacoes);

    List<Transacoes> procurarTodos();

    Optional<Transacoes> procurarPorId(Integer id);

    Transacoes atualizar (Transacoes transacoes);

    void deleteById(Integer id);
}
