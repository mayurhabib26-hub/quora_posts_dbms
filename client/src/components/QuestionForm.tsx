import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const QuestionForm = ({ show, handleClose, handleSubmit, initialData }) => {
    const [formData, setFormData] = useState({ title: '', content: '', category: 'DBMS' });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                category: initialData.category || 'DBMS'
            });
        } else {
            setFormData({ title: '', content: '', category: 'DBMS' });
        }
    }, [initialData, show]);

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">{initialData ? 'Edit Question' : 'Ask a Question'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onFormSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="What is your question about DBMS?"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-light"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Category</Form.Label>
                        <Form.Select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="bg-light"
                        >
                            <option value="DBMS">General DBMS</option>
                            <option value="SQL">SQL Queries</option>
                            <option value="Normalization">Normalization</option>
                            <option value="Transactions">Transactions & Concurrency</option>
                            <option value="NoSQL">NoSQL Databases</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Provide more details for your question..."
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="bg-light"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" type="submit">
                        {initialData ? 'Update Question' : 'Post Question'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default QuestionForm;
