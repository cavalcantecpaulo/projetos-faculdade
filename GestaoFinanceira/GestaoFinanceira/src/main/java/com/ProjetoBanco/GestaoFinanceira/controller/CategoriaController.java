package com.ProjetoBanco.GestaoFinanceira.controller;

import com.ProjetoBanco.GestaoFinanceira.model.Categoria;
import com.ProjetoBanco.GestaoFinanceira.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<Categoria>> procurarTodos(){
        return ResponseEntity.status(HttpStatus.OK).body(categoriaService.procurarTodos());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Categoria>> procurarPorId(@PathVariable Integer id){
        return ResponseEntity.status(HttpStatus.OK).body(categoriaService.procurarPorId(id));
    }
    @PostMapping
    public ResponseEntity <Categoria> criar (@RequestBody Categoria categoria){
        categoria.setId_categoria(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.salvar(categoria));
    }

    @PutMapping
    public ResponseEntity<Categoria> atualizar (@RequestBody Categoria categoria){
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.atualizar(categoria));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> apagar (@PathVariable Integer id){
        categoriaService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
