// src/component/Categorias.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import '../Styles/Categorias.css';

function Categorias() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newCategory, setNewCategory] = useState('');


    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, []);

    // Cargar categorías
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/category');

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setCategories(result.data);
            } else {
                throw new Error('Formato de respuesta inesperado');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('No se pudieron cargar las categorías: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Crear nueva categoría
    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!newCategory.trim()) {
            setError('Por favor ingresa el nombre de la categoría');
            return;
        }

        try {
            setCreating(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('http://localhost:5000/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCategory.trim()
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('¡Categoría creada exitosamente!');
                setNewCategory('');
                // Recargar la lista de categorías
                fetchCategories();
            } else {
                setError(result.error || 'Error al crear la categoría');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            setError('Error al conectar con el servidor');
        } finally {
            setCreating(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        setNewCategory(e.target.value);
        // Limpiar errores cuando el usuario empiece a escribir
        if (error) {
            setError(null);
        }
    };

    return (
        <Container className="categorias-container">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    {/* Header */}
                    <div className="categorias-header text-center mb-4">
                        <h2 className="categorias-title">Gestión de Categorías</h2>
                        <p className="categorias-subtitle">
                            Administra las categorías
                        </p>
                    </div>

                    {/* Formulario para crear categoría */}
                    <Card className="categorias-form-card mb-4">
                        <Card.Header className="categorias-form-header">
                            <h4 className="mb-0">Crear Nueva Categoría</h4>
                        </Card.Header>
                        <Card.Body className="categorias-form-body">
                            <Form onSubmit={handleCreateCategory}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="categorias-label">
                                        Nombre de la Categoría *
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newCategory}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Electrónicos, Ropa, Hogar..."
                                        className="categorias-input"
                                        disabled={creating}
                                    />
                                    <Form.Text className="categorias-form-text">
                                        Ingresa el nombre de la nueva categoría
                                    </Form.Text>
                                </Form.Group>

                                <div className="categorias-form-buttons">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={creating || !newCategory.trim()}
                                        className="categorias-create-button"
                                    >
                                        {creating ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Creando...
                                            </>
                                        ) : (
                                            'Crear Categoría'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Alertas */}
                    {error && (
                        <Alert variant="danger" className="categorias-alert danger">
                            <Alert.Heading>Error</Alert.Heading>
                            <p className="mb-0">{error}</p>
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="success" className="categorias-alert success">
                            <Alert.Heading>✅ ¡Éxito!</Alert.Heading>
                            <p className="mb-0">{success}</p>
                        </Alert>
                    )}

                    {/* Lista de categorías */}
                    <Card className="categorias-list-card">
                        <Card.Header className="categorias-list-header">
                            <h4 className="mb-0">Categorías Existentes</h4>
                            <span className="categorias-count">
                                {categories.length} categoría{categories.length !== 1 ? 's' : ''}
                            </span>
                        </Card.Header>
                        <Card.Body className="categorias-list-body">
                            {loading ? (
                                <div className="categorias-loading text-center">
                                    <Spinner animation="border" variant="primary" className="categorias-spinner" />
                                    <p className="categorias-loading-text">Cargando categorías...</p>
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="categorias-empty text-center">
                                    <p className="categorias-empty-text">
                                        No hay categorías disponibles. Crea la primera categoría.
                                    </p>
                                </div>
                            ) : (
                                <div className="categorias-grid">
                                    {categories.map((category) => (
                                        <div key={category.id} className="categoria-item">
                                            <div className="categoria-content">
                                                <span className="categoria-name">{category.name}</span>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Categorias;