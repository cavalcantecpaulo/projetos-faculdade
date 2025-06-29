package com.ProjetoBanco.GestaoFinanceira.service;

import com.ProjetoBanco.GestaoFinanceira.model.TipoTransacao;
import com.ProjetoBanco.GestaoFinanceira.repository.TipoTransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoTransacaoServiceImplements implements TipoTransacaoService{

    @Autowired
    private TipoTransacaoRepository tipoTransacaoRepository;

    @Override
    public TipoTransacao salvar(TipoTransacao tipoTransacao) {
        return tipoTransacaoRepository.save(tipoTransacao);
    }

    @Override
    public List<TipoTransacao> procurarTodos() {
        return tipoTransacaoRepository.findAll();
    }

    @Override
    public Optional<TipoTransacao> procurarPorId(Integer id) {
        return tipoTransacaoRepository.findById(id);
    }

    @Override
    public TipoTransacao atualizar(TipoTransacao tipoTransacao) {
        return tipoTransacaoRepository.save(tipoTransacao);
    }

    @Override
    public void deleteById(Integer id) {
        tipoTransacaoRepository.deleteById(id);
    }
}
