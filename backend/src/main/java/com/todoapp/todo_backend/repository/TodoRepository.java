package com.todoapp.todo_backend.repository;

import com.todoapp.todo_backend.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND t.deleted = false")
    List<Todo> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT t FROM Todo t WHERE t.completed = :completed AND t.deleted = false")
    List<Todo> findByCompleted(@Param("completed") boolean completed);

    List<Todo> findByDeletedFalse();

    Page<Todo> findByDeletedFalse(Pageable pageable);

    Optional<Todo> findByIdAndDeletedFalse(Long id);
}