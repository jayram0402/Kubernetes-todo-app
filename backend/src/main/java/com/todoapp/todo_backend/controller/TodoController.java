package com.todoapp.todo_backend.controller;

import com.todoapp.todo_backend.dto.TodoDTO;
import com.todoapp.todo_backend.service.TodoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<TodoDTO> createTodo(@Valid @RequestBody TodoDTO todoDTO) {
        TodoDTO created = todoService.createTodo(todoDTO);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, "/api/todos/" + created.getId());
        return new ResponseEntity<>(created, headers, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoDTO> getTodo(@PathVariable Long id) {
        TodoDTO todo = todoService.getTodoById(id);
        return ResponseEntity.ok(todo);
    }

    @GetMapping
    public ResponseEntity<List<TodoDTO>> getAllTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TodoDTO> todosPage = todoService.getAllTodosPaginated(pageable);
        return ResponseEntity.ok(todosPage.getContent());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDTO> updateTodo(@PathVariable Long id, @Valid @RequestBody TodoDTO todoDTO) {
        TodoDTO updated = todoService.updateTodo(id, todoDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteTodo(@PathVariable Long id) {
        todoService.softDeleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TodoDTO>> getByCompleted(@RequestParam boolean completed) {
        return ResponseEntity.ok(todoService.getTodosByCompleted(completed));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TodoDTO>> searchTodosByTitle(@RequestParam String keyword) {
        return ResponseEntity.ok(todoService.searchTodosByTitle(keyword));
    }
}
