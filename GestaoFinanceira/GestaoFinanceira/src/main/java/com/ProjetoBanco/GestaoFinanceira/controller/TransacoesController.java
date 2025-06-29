package com.ProjetoBanco.GestaoFinanceira.controller;

import com.ProjetoBanco.GestaoFinanceira.model.Categoria;
import com.ProjetoBanco.GestaoFinanceira.model.Transacoes;
import com.ProjetoBanco.GestaoFinanceira.service.TransacoesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/transacoes")
public class TransacoesController {

    @Autowired
    private TransacoesService transacoesService;

    @GetMapping
    public ResponseEntity<List<Transacoes>> procurarTodos(){
        return ResponseEntity.status(HttpStatus.OK).body(transacoesService.procurarTodos());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Transacoes>> procurarPorId(@PathVariable Integer id){
        return ResponseEntity.status(HttpStatus.OK).body(transacoesService.procurarPorId(id));
    }
    @PostMapping
    public ResponseEntity <Transacoes> criar (@RequestBody Transacoes transacoes){
        transacoes.setId_transacao(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(transacoesService.salvar(transacoes));
    }

    @PutMapping
    public ResponseEntity<Transacoes> atualizar (@RequestBody Transacoes transacoes){
        return ResponseEntity.status(HttpStatus.CREATED).body(transacoesService.atualizar(transacoes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> apagar (@PathVariable Integer id){
        transacoesService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
