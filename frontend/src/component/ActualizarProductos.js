// src/component/ActualizarProductos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../Styles/ActualizarProductos.css';

function ActualizarProductos() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Función para truncar texto largo
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Función para truncar título
    const truncateTitle = (title, maxLength = 50) => {
        if (!title) return '';
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    };

    // Función para obtener imagen aleatoria
    const getRandomImage = (productId) => {
        const imageServices = [
            `https://picsum.photos/id/237/200/300`
        ];
        return imageServices[productId % imageServices.length];
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/products');
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setProducts(result.data);
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

    if (loading) {
        return (
            <Container className="actualizar-productos-container">
                <div className="actualizar-productos-loading text-center">
                    <Spinner animation="border" role="status" variant="primary" className="actualizar-productos-spinner">
                        <span className="visually-hidden">Cargando productos...</span>
                    </Spinner>
                    <p className="actualizar-productos-loading-text">Cargando productos...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="actualizar-productos-container">
                <Alert variant="danger" className="actualizar-productos-alert">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-primary" onClick={fetchProducts} className="actualizar-productos-retry-btn">
                        Reintentar
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="actualizar-productos-container">
            <Row className="mb-4 pt-50">
                <Col>
                    <div className="pt-5"> {/* Bootstrap pt-5 = 3rem ≈ 48px */}
                        <h2 className="text-center" style={{ color: '#20B2AA' }}>
                            Actualizar Productos
                        </h2>
                        <p className="text-center text-muted">
                            Selecciona un producto para actualizar sus datos
                        </p>
                    </div>
                </Col>



            </Row>

            {products.length === 0 ? (
                <Row>
                    <Col>
                        <Alert variant="info" className="actualizar-productos-empty-alert text-center">
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
                                className="actualizar-productos-card"
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
                                    className="actualizar-productos-card-image"
                                    onError={(e) => {
                                        e.target.src = getRandomImage(product.id);
                                    }}
                                />
                                <Card.Body className="actualizar-productos-card-body">
                                    <Card.Title
                                        className="actualizar-productos-card-title"
                                        title={product.title}
                                    >
                                        {truncateTitle(product.title)}
                                    </Card.Title>

                                    <div className="mb-2">
                                        <span className="actualizar-productos-category-badge">
                                            {product.category}
                                        </span>
                                    </div>

                                    <Card.Text
                                        className="actualizar-productos-card-description"
                                        title={product.description}
                                    >
                                        {truncateText(product.description, 120)}
                                    </Card.Text>

                                    <div className="actualizar-productos-card-footer">
                                        <div className="actualizar-productos-price-container">
                                            <strong className="actualizar-productos-price">${product.price}</strong>
                                        </div>

                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleUpdateClick(product)}
                                            className="actualizar-productos-update-btn"
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