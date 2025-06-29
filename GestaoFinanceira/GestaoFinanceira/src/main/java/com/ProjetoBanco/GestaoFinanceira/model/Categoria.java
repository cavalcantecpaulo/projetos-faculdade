package com.ProjetoBanco.GestaoFinanceira.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_categoria;
    private String nome;
}
