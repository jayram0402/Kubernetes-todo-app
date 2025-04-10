package com.todoapp.todo_backend.mapper;

import com.todoapp.todo_backend.dto.TodoDTO;
import com.todoapp.todo_backend.model.Todo;

import java.util.List;
import java.util.stream.Collectors;

public class TodoMapper {

    public static TodoDTO toDTO(Todo todo) {
        if (todo == null) return null;
        TodoDTO dto = new TodoDTO();
        dto.setId(todo.getId());
        dto.setTitle(todo.getTitle());
        dto.setDescription(todo.getDescription());
        dto.setCreatedAt(todo.getCreatedAt());
        dto.setCompleted(todo.isCompleted());
        return dto;
    }

    public static Todo toEntity(TodoDTO dto) {
        if (dto == null) return null;
        Todo todo = new Todo();
        todo.setId(dto.getId());
        todo.setTitle(dto.getTitle());
        todo.setDescription(dto.getDescription());
        todo.setCompleted(dto.isCompleted());
        return todo;
    }

    public static List<TodoDTO> toDTOList(List<Todo> todos) {
        if (todos == null) return null;
        return todos.stream()
                    .map(TodoMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public static List<Todo> toEntityList(List<TodoDTO> dtos) {
        if (dtos == null) return null;
        return dtos.stream()
                   .map(TodoMapper::toEntity)
                   .collect(Collectors.toList());
    }
}