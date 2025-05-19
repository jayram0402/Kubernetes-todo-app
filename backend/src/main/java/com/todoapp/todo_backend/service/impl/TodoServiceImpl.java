package com.todoapp.todo_backend.service.impl;

import com.todoapp.todo_backend.dto.TodoDTO;
import com.todoapp.todo_backend.exceptions.ResourceNotFoundException;
import com.todoapp.todo_backend.mapper.TodoMapper;
import com.todoapp.todo_backend.model.Todo;
import com.todoapp.todo_backend.repository.TodoRepository;
import com.todoapp.todo_backend.service.TodoService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Override
    public TodoDTO createTodo(TodoDTO todoDTO) {
        Objects.requireNonNull(todoDTO, "TodoDTO cannot be null");
        Todo todo = TodoMapper.toEntity(todoDTO);
        Todo saved = todoRepository.save(todo);
        return TodoMapper.toDTO(saved);
    }

    @Override
    public TodoDTO getTodoById(Long id) {
        Todo todo = todoRepository.findByIdAndDeletedFalse(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return TodoMapper.toDTO(todo);
    }

    @Override
    public List<TodoDTO> getAllTodos() {
        return TodoMapper.toDTOList(todoRepository.findByDeletedFalse());
    }

    @Override
    public Page<TodoDTO> getAllTodosPaginated(Pageable pageable) {
        Page<Todo> todosPage = todoRepository.findByDeletedFalse(pageable);
        return todosPage.map(TodoMapper::toDTO);
    }

    @Override
    public TodoDTO updateTodo(Long id, TodoDTO todoDTO) {
        Objects.requireNonNull(todoDTO, "TodoDTO cannot be null");
        Todo existing = todoRepository.findByIdAndDeletedFalse(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        existing.setTitle(todoDTO.getTitle());
        existing.setDescription(todoDTO.getDescription());
        existing.setCompleted(todoDTO.isCompleted());
        Todo updated = todoRepository.save(existing);
        return TodoMapper.toDTO(updated);
    }

    @Override
    public void softDeleteTodo(Long id) {
        Todo todo = todoRepository.findByIdAndDeletedFalse(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        todo.setDeleted(true);
        todoRepository.save(todo);
    }

    @Override
    public List<TodoDTO> getTodosByCompleted(boolean completed) {
        return TodoMapper.toDTOList(todoRepository.findByCompleted(completed));
    }

    @Override
    public List<TodoDTO> searchTodosByTitle(String keyword) {
        return TodoMapper.toDTOList(todoRepository.searchByKeyword(keyword));
    }
}