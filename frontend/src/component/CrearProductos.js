// src/component/CrearProductos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import '../Styles/CrearProductos.css';

function CrearProductos() {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        categoryId: '',
        image: '',
        ratingRate: '',
        ratingCount: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Cargar categorías al montar el componente
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await fetch('http://localhost:5000/category');
            const result = await response.json();
            
            if (result.success) {
                setCategories(result.data);
            } else {
                setError('Error al cargar categorías');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Error al cargar categorías');
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        // Validar título
        if (!formData.title.trim()) {
            errors.title = 'El título es requerido';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'El título debe tener al menos 3 caracteres';
        }

        // Validar precio
        if (!formData.price) {
            errors.price = 'El precio es requerido';
        } else if (parseFloat(formData.price) <= 0) {
            errors.price = 'El precio debe ser mayor a 0';
        }

        // Validar descripción
        if (!formData.description.trim()) {
            errors.description = 'La descripción es requerida';
        } else if (formData.description.trim().length < 10) {
            errors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        // Validar categoría
        if (!formData.categoryId) {
            errors.categoryId = 'La categoría es requerida';
        }

        // Validar imagen
        if (!formData.image.trim()) {
            errors.image = 'La URL de la imagen es requerida';
        } else {
            try {
                new URL(formData.image);
            } catch (err) {
                errors.image = 'La URL de la imagen no es válida';
            }
        }

        // Validar rating rate
        if (!formData.ratingRate) {
            errors.ratingRate = 'La calificación es requerida';
        } else {
            const rate = parseFloat(formData.ratingRate);
            if (rate < 0 || rate > 5) {
                errors.ratingRate = 'La calificación debe estar entre 0 y 5';
            }
        }

        // Validar rating count
        if (!formData.ratingCount) {
            errors.ratingCount = 'El número de reseñas es requerido';
        } else if (parseInt(formData.ratingCount) < 0) {
            errors.ratingCount = 'El número de reseñas debe ser mayor o igual a 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validar formulario antes de enviar
        if (!validateForm()) {
            setError('Por favor, corrige los errores en el formulario');
            return;
        }

        setLoading(true);

        try {
            // Preparar datos para enviar
            const productData = {
                title: formData.title.trim(),
                price: parseFloat(formData.price),
                description: formData.description.trim(),
                categoryId: parseInt(formData.categoryId),
                image: formData.image.trim(),
                rating: {
                    rate: parseFloat(formData.ratingRate),
                    count: parseInt(formData.ratingCount)
                }
            };

            console.log('Enviando producto:', productData);

            const response = await fetch('http://localhost:5000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            if (result.success) {
                setSuccess(true);
                // Limpiar formulario
                setFormData({
                    title: '',
                    price: '',
                    description: '',
                    categoryId: '',
                    image: '',
                    ratingRate: '',
                    ratingCount: ''
                });
                setFormErrors({});
            } else {
                setError(result.error || 'Error al crear el producto');
            }
        } catch (err) {
            console.error('Error creating product:', err);
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const getInputClassName = (fieldName) => {
        return formErrors[fieldName] ? 'crear-productos-input-error' : 'crear-productos-input';
    };

    const getSelectClassName = (fieldName) => {
        return formErrors[fieldName] ? 'crear-productos-select-error' : 'crear-productos-select';
    };

    const getTextareaClassName = (fieldName) => {
        return formErrors[fieldName] ? 'crear-productos-textarea-error' : 'crear-productos-textarea';
    };

    return (
        <Container className="crear-productos-container">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card className="crear-productos-card">
                        <Card.Header className="crear-productos-header">
                            <h3 className="mb-0">Crear Nuevo Producto</h3>
                            <small>Todos los campos son obligatorios</small>
                        </Card.Header>
                        
                        <Card.Body className="crear-productos-body">
                            {success && (
                                <Alert variant="success" className="crear-productos-alert success">
                                    <Alert.Heading>¡Producto creado exitosamente!</Alert.Heading>
                                    <p>El producto ha sido agregado a la base de datos.</p>
                                </Alert>
                            )}

                            {error && (
                                <Alert variant="danger" className="crear-productos-alert danger">
                                    <Alert.Heading>Error</Alert.Heading>
                                    <p>{error}</p>
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit} noValidate>
                                <Row className="crear-productos-row">
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="crear-productos-label">
                                                Título del Producto *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Laptop Gaming Pro"
                                                required
                                                className={getInputClassName('title')}
                                                isInvalid={!!formErrors.title}
                                            />
                                            <Form.Control.Feedback type="invalid" className="crear-productos-feedback invalid">
                                                {formErrors.title}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="crear-productos-row">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="crear-productos-label">
                                                Precio *
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="99.99"
                                                step="0.01"
                                                min="0.01"
                                                required
                                                className={getInputClassName('price')}
                                                isInvalid={!!formErrors.price}
                                            />
                                            <Form.Control.Feedback type="invalid" className="crear-productos-feedback invalid">
                                                {formErrors.price}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="crear-productos-label">
                                                Categoría *
                                            </Form.Label>
                                            <Form.Select
                                                name="categoryId"
                                                value={formData.categoryId}
                                                onChange={handleInputChange}
                                                required
                                                className={getSelectClassName('categoryId')}
                                                isInvalid={!!formErrors.categoryId}
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                {categoriesLoading ? (
                                                    <option disabled>Cargando categorías...</option>
                                                ) : (
                                                    categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))
                                                )}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid" className="crear-productos-feedback invalid">
                                                {formErrors.categoryId}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="crear-productos-label">
                                        Descripción *
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe las características del producto..."
                                        rows={3}
                                        required
                                        className={getTextareaClassName('description')}
                                        isInvalid={!!formErrors.description}
                                    />
                                    <Form.Control.Feedback type="invalid" className="crear-productos-feedback invalid">
                                        {formErrors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="crear-productos-label">
                                        URL de Imagen *
                                    </Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        required
                                        className={getInputClassName('image')}
                                        isInvalid={!!formErrors.image}
                                    />
                                    <Form.Control.Feedback type="invalid" className="crear-productos-feedback invalid">
                                        {formErrors.image}
                                    </Form.Control.Feedback>
                                    <Form.Text className="crear-productos-form-text">
                                        Debe ser una URL válida de una imagen
                                    </Form.Text>
                                </Form.Group>

                                <Row className="crear-productos-row">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="crear-productos-label">
                                                Calificación (0-5) *
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ratingRate"
                                                value={formData.ratingRate}
                                                onChange={handleInputChange}
                                                placeholder="4.5"
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                required
                                                className={getInputClassName('ratingRate')}
                                                isInvalid={!!formErrors.ratingRate}
                                            />
                                            <Form.Control.Feedback type="invalid" className="crear-productos-feedback invalid">
                                                {formErrors.ratingRate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="crear-productos-label">
                                                Número de Reseñas *
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ratingCount"
                                                value={formData.ratingCount}
                                                onChange={handleInputChange}
                                                placeholder="120"
                                                min="0"
                                                required
                                                className={getInputClassName('ratingCount')}
                                                isInvalid={!!formErrors.ratingCount}
                                            />
                                            <Form.Control.Feedback type="invalid" className="crear-productos-feedback invalid">
                                                {formErrors.ratingCount}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="text-center mt-4">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={loading}
                                        className="crear-productos-button"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Creando...
                                            </>
                                        ) : (
                                            'Crear Producto'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CrearProductos;