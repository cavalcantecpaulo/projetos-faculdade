package com.ProjetoBanco.GestaoFinanceira.controller;

import com.ProjetoBanco.GestaoFinanceira.model.TipoTransacao;
import com.ProjetoBanco.GestaoFinanceira.service.TipoTransacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/tipo")
@CrossOrigin(origins = "*")
public class TipoTransacaoController {

    @Autowired
    private TipoTransacaoService tipoService;

    @GetMapping
    public ResponseEntity<List<TipoTransacao>> procurarTodos(){
        return ResponseEntity.status(HttpStatus.OK).body(tipoService.procurarTodos());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<TipoTransacao>> procurarPorId(@PathVariable Integer id){
        return ResponseEntity.status(HttpStatus.OK).body(tipoService.procurarPorId(id));
    }
    @PostMapping
    public ResponseEntity <TipoTransacao> criar (@RequestBody TipoTransacao tipoTransacao){
        tipoTransacao.setId_tipo_transacao(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoService.salvar(tipoTransacao));
    }

    @PutMapping
    public ResponseEntity<TipoTransacao> atualizar (@RequestBody TipoTransacao tipoTransacao){
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoService.atualizar(tipoTransacao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> apagar (@PathVariable Integer id){
        tipoService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
