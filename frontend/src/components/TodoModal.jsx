import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = '/api/todos';

function TodoModal({ show, onHide, todo, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate modal fields on open or reset if no todo
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title ?? '',
        description: todo.description ?? '',
        completed: todo.completed ?? false,
      });
    } else {
      setFormData({ title: '', description: '', completed: false });
    }
  }, [todo, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { title, description } = formData;

    // Basic validation
    if (!title.trim()) return showError('Title is required');
    if (title.length < 2 || title.length > 100)
      return showError('Title must be 2-100 characters');
    if (!description.trim()) return showError('Description is required');
    if (description.length > 500)
      return showError('Description must not exceed 500 characters');

    try {
      if (todo) {
        await axios.put(`${API_URL}/${todo.id}`, formData);
        toast.success('Todo updated!');
      } else {
        await axios.post(API_URL, formData);
        toast.success('Todo created!');
      }

      onSave?.(); // Optional chaining for safety
      onHide();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || `Failed to save todo: ${err.message}`;
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg) => {
    setError(msg);
    setLoading(false);
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
              disabled={loading}
              minLength={2}
              maxLength={100}
              required
              isInvalid={formData.title.length < 2 || formData.title.length > 100}
            />
            <Form.Control.Feedback type="invalid">
              Title must be between 2 and 100 characters.
            </Form.Control.Feedback>
            <Form.Text muted>{formData.title.length}/100 characters</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              disabled={loading}
              required
              isInvalid={formData.description.length > 500}
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
            <Form.Control.Feedback type="invalid">
              Max 500 characters allowed.
            </Form.Control.Feedback>
            <Form.Text muted>{formData.description.length}/500 characters</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          {todo?.createdAt && (
            <Form.Group className="mb-3">
              <Form.Label>Created At</Form.Label>
              <Form.Control
                type="text"
                value={new Date(todo.createdAt).toLocaleString()}
                disabled
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
