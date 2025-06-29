package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.TipoTransacao;

import java.util.List;
import java.util.Optional;

public interface TipoTransacaoService {
    TipoTransacao salvar (TipoTransacao tipoTransacao);

    List<TipoTransacao> procurarTodos();

    Optional<TipoTransacao> procurarPorId(Integer id);

    TipoTransacao atualizar (TipoTransacao categoria);

    void deleteById(Integer id);
}
