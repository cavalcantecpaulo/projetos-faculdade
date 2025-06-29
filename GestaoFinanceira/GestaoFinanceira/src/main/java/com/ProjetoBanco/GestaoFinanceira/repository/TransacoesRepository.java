package com.ProjetoBanco.GestaoFinanceira.repository;

import com.ProjetoBanco.GestaoFinanceira.model.Transacoes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransacoesRepository extends JpaRepository<Transacoes, Integer> {
}
