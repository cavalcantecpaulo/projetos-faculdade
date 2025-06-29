package com.ProjetoBanco.GestaoFinanceira.controller;

import com.ProjetoBanco.GestaoFinanceira.model.Usuario;
import com.ProjetoBanco.GestaoFinanceira.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping ("api/v1/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @GetMapping("/teste")
    public String testandoController() {
        return "É O SANTOS";
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> procurarTodos(){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.procurarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Usuario>> procurarPorId(@PathVariable Integer id){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.procurarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario){
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criar(usuario));
    }

    @PutMapping
    public ResponseEntity<Usuario> atualizar(@RequestBody Usuario usuario){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.atualizar(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id){
        usuarioService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
