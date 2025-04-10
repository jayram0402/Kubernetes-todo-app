
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = '/api/todos';

function TodoModal({ show, onHide, todo, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        completed: todo.completed || false
      });
    } else {
      setFormData({ title: '', description: '', completed: false });
    }
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation matching TodoDTO constraints
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    if (formData.title.length < 2 || formData.title.length > 100) {
      setError('Title must be between 2 and 100 characters');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }
    if (formData.description.length > 500) {
      setError('Description must not exceed 500 characters');
      setLoading(false);
      return;
    }

    try {
      if (todo) {
        await axios.put(`${API_URL}/${todo.id}`, formData);
        toast.success('Todo updated successfully');
      } else {
        await axios.post(API_URL, formData);
        toast.success('Todo created successfully');
      }
      onSave();
      onHide();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save todo: ' + error.message;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" dialogClassName="modal-fluid">
      <Modal.Header closeButton>
        <Modal.Title>{todo ? 'Edit Todo' : 'Add New Todo'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && (
            <Alert variant="info">
              <Spinner animation="border" size="sm" /> Saving...
            </Alert>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              disabled={loading}
              className="shadow-sm"
              isInvalid={formData.title && (formData.title.length < 2 || formData.title.length > 100)}
            />
            <Form.Control.Feedback type="invalid">
              Title must be 2-100 characters
            </Form.Control.Feedback>
            <Form.Text muted>
              {formData.title.length}/100 characters
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={500}
              disabled={loading}
              className="shadow-sm"
              rows={3}
              style={{ resize: 'vertical', minHeight: '100px' }}
              isInvalid={formData.description && formData.description.length > 500}
            />
            <Form.Control.Feedback type="invalid">
              Description must not exceed 500 characters
            </Form.Control.Feedback>
            <Form.Text muted>
              {formData.description.length}/500 characters
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="completed"
              label="Completed"
              checked={formData.completed}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
          {todo && (
            <Form.Group className="mb-3">
              <Form.Label>Created At</Form.Label>
              <Form.Control
                type="text"
                value={new Date(todo.createdAt).toLocaleString()}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between flex-wrap gap-2">
          <Button 
            variant="secondary" 
            onClick={onHide} 
            disabled={loading}
            className="btn-custom flex-grow-1"
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="btn-custom flex-grow-1"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TodoModal;