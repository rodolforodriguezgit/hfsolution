// src/component/ActualizarProductos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ActualizarProductos() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // Función para obtener imagen aleatoria
    const getRandomImage = (productId) => {
        const imageServices = [
            `https://picsum.photos/id/237/200/300`
        ];
        return imageServices[productId % imageServices.length];
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Cargando productos para actualizar...');

            const response = await fetch('http://localhost:5000/products');
            const result = await response.json();
            console.log('📦 Resultado:', result);

            if (result.success && Array.isArray(result.data)) {
                setProducts(result.data);
                console.log('🎉 Productos cargados:', result.data.length);
            } else {
                setError('Formato de respuesta inesperado del servidor');
            }
        } catch (err) {
            console.error('💥 Error en fetch:', err);
            setError('No se pudo conectar con el servidor: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleUpdateClick = (product) => {
        // Navegar a la página de edición con el producto como estado
        navigate('/editar-producto', { state: { product } });
    };

    const cardStyle = {
        border: 'none',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        transition: 'transform 0.2s ease-in-out'
    };

    const updateButtonStyle = {
        backgroundColor: '#20B2AA',
        borderColor: '#20B2AA',
        borderRadius: '20px',
        padding: '8px 20px',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Cargando productos...</span>
                </Spinner>
                <p className="mt-3">Cargando productos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={fetchProducts}>
                        Reintentar
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center" style={{ color: '#20B2AA' }}>
                        Actualizar Productos
                    </h2>
                    <p className="text-center text-muted">
                        Selecciona un producto para actualizar sus datos
                    </p>
                </Col>
            </Row>

            {products.length === 0 ? (
                <Row>
                    <Col>
                        <Alert variant="info" className="text-center">
                            <Alert.Heading>No hay productos</Alert.Heading>
                            <p>No se encontraron productos para actualizar.</p>
                        </Alert>
                    </Col>
                </Row>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card 
                                className="h-100 shadow-sm" 
                                style={cardStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <Card.Img
                                    variant="top"
                                    src={product.image || getRandomImage(product.id)}
                                    style={{
                                        height: '200px',
                                        objectFit: 'cover',
                                        padding: '10px'
                                    }}
                                    onError={(e) => {
                                        e.target.src = getRandomImage(product.id);
                                    }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title
                                        className="flex-grow-1"
                                        style={{ fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}
                                    >
                                        {product.title}
                                    </Card.Title>

                                    <div className="mb-2">
                                        <span
                                            className="badge"
                                            style={{ backgroundColor: '#20B2AA', color: 'white' }}
                                        >
                                            {product.category}
                                        </span>
                                    </div>

                                    <Card.Text
                                        className="text-muted small flex-grow-1"
                                        style={{ height: '60px', overflow: 'hidden' }}
                                    >
                                        {product.description}
                                    </Card.Text>

                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <strong className="text-success h5">${product.price}</strong>
                                        </div>

                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleUpdateClick(product)}
                                            style={updateButtonStyle}
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#1a9b96';
                                                e.target.style.borderColor = '#1a9b96';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = '#20B2AA';
                                                e.target.style.borderColor = '#20B2AA';
                                            }}
                                        >
                                            ✏️ Actualizar Producto
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default ActualizarProductos;
