
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Pagination, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import TodoModal from './TodoModal';
import { toast } from 'react-toastify';

const API_URL = '/api/todos';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // For createdAt sorting

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}?page=${currentPage}&size=10`;
      if (searchTerm) {
        url = `${API_URL}/search?keyword=${searchTerm}`;
      } else if (filterCompleted !== null) {
        url = `${API_URL}/filter?completed=${filterCompleted}`;
      }
      
      const response = await axios.get(url);
      let sortedTodos = [...response.data];
      sortedTodos.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setTodos(sortedTodos);
    } catch (error) {
      setError('Failed to fetch todos: ' + error.message);
      toast.error('Error fetching todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [currentPage, searchTerm, filterCompleted, sortOrder]);

  const handleCreate = () => {
    setSelectedTodo(null);
    setShowModal(true);
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Todo deleted successfully');
      fetchTodos();
    } catch (error) {
      setError('Failed to delete todo: ' + error.message);
      toast.error('Error deleting todo');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container fluid className="todo-container mx-auto">
      <Row className="mb-3 align-items-center">
        <Col xs={12}>
          <h1 className="display-4 todo-header">Todos App</h1>
          <p className="text-muted subtitle">Developed by Ezekiel Lemana</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && (
        <Alert variant="info">
          <Spinner animation="border" size="sm" /> Loading...
        </Alert>
      )}

      <Row className="mb-4 controls-row">
        <Col xs={12} sm={6} md={4}>
          <Form.Control
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={handleSearch}
            disabled={loading}
            className="shadow-sm"
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Select
            onChange={(e) => setFilterCompleted(e.target.value === '' ? null : e.target.value === 'true')}
            disabled={loading}
            className="shadow-sm"
          >
            <option value="">All Todos</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <Button 
            variant="primary" 
            onClick={handleCreate} 
            disabled={loading}
            className="btn-custom shadow-sm"
          >
            Add Todo
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Completed</th>
              <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                Created At {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.completed ? 'Yes' : 'No'}</td>
                <td>{formatDate(todo.createdAt)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="btn-custom flex-grow-1"
                      onClick={() => handleEdit(todo)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="btn-custom flex-grow-1"
                      onClick={() => handleDelete(todo.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0 || loading}
        />
        <Pagination.Item active>{currentPage + 1}</Pagination.Item>
        <Pagination.Next
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={todos.length < 10 || loading}
        />
      </Pagination>

      <TodoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        todo={selectedTodo}
        onSave={fetchTodos}
      />
    </Container>
  );
}

export default TodoList;