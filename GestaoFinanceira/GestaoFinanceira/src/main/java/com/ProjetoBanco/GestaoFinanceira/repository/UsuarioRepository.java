package com.ProjetoBanco.GestaoFinanceira.repository;

import com.ProjetoBanco.GestaoFinanceira.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
}
