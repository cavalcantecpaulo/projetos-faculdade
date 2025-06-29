package com.ProjetoBanco.GestaoFinanceira.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
public class Transacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_transacao;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_tipo_transacao")
    private TipoTransacao tipoTransacao;

    private BigDecimal valor;
    private LocalDate data_transacao;
    private String descricao;
}
