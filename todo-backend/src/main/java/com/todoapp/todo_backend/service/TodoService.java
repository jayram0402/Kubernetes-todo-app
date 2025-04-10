package com.todoapp.todo_backend.service;

import com.todoapp.todo_backend.dto.TodoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TodoService {

    TodoDTO createTodo(TodoDTO todoDTO);

    TodoDTO getTodoById(Long id);

    List<TodoDTO> getAllTodos();

    Page<TodoDTO> getAllTodosPaginated(Pageable pageable);

    TodoDTO updateTodo(Long id, TodoDTO todoDTO);

    void softDeleteTodo(Long id);

    List<TodoDTO> getTodosByCompleted(boolean completed);

    List<TodoDTO> searchTodosByTitle(String keyword);
}