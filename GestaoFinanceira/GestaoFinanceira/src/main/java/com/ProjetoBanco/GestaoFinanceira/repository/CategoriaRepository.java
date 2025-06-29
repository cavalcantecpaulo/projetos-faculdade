package com.ProjetoBanco.GestaoFinanceira.repository;

import com.ProjetoBanco.GestaoFinanceira.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}
