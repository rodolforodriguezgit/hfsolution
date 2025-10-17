// src/component/ListarProductos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import '../Styles/ListarProductos.css';

function ListarProductos() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    // Función para obtener imagen aleatoria
    const getRandomImage = (productId) => {
        const imageServices = [
            `https://picsum.photos/id/237/200/300`
        ];
        return imageServices[productId % imageServices.length];
    };

    // Función para truncar texto largo (solo si es muy extenso)
    const truncateText = (text, maxLength = 200) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Función para truncar título
    const truncateTitle = (title, maxLength = 60) => {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    };

    // Función para expandir/contraer descripción
    const toggleDescription = (productId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Función para determinar si mostrar botón "Ver más"
    const shouldShowReadMore = (description) => {
        return description.length > 200;
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/products');

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (Array.isArray(result)) {
                setProducts(result);
            } else if (result.success && Array.isArray(result.data)) {
                setProducts(result.data);
            } else {
                setError('Formato de respuesta inesperado del servidor');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Container className="loading-container">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Cargando productos...</span>
                </Spinner>
                <p className="mt-3">Cargando productos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="error-container">
                <Alert variant="danger" className="error-alert">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={fetchProducts} className="retry-button">
                        Reintentar
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="listar-productos-container">
            <Row className="mb-4">
                <Col>
                    <h2 className="listar-productos-title">Nuestros Productos</h2>
                    <p className="listar-productos-subtitle">
                        Descubre nuestra selección de productos de calidad
                    </p>
                </Col>
            </Row>

            {/* Contenedor centrado pero con cards alineadas a la izquierda */}
            <div className="products-grid-container">
                <Row className="products-row">
                    {products.map((product) => (
                        <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card className="product-card">
                                <Card.Img
                                    variant="top"
                                    src={product.image || getRandomImage(product.id)}
                                    className="product-card-image"
                                    onError={(e) => {
                                        e.target.src = getRandomImage(product.id);
                                    }}
                                />
                                <Card.Body className="product-card-body">
                                    {/* Sección fija para título y categoría */}
                                    <div className="product-title-section">
                                        <Card.Title className="product-title" title={product.title}>
                                            {truncateTitle(product.title)}
                                        </Card.Title>

                                        <div>
                                            <span className="badge product-category-badge">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Descripción - área flexible */}
                                    <div className="product-description-section">
                                        <Card.Text 
                                            className={`product-description ${expandedDescriptions[product.id] ? 'expanded' : 'collapsed'}`}
                                        >
                                            {expandedDescriptions[product.id] 
                                                ? product.description 
                                                : truncateText(product.description, 180)
                                            }
                                        </Card.Text>
                                        
                                        {/* Contenedor del botón - siempre presente pero con contenido condicional */}
                                        <div className="read-more-button-container">
                                            {shouldShowReadMore(product.description) && (
                                                <button
                                                    className="read-more-button"
                                                    onClick={() => toggleDescription(product.id)}
                                                >
                                                    {expandedDescriptions[product.id] ? 'Ver menos' : 'Ver más'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sección fija para precio y rating */}
                                    <div className="product-price-section">
                                        <div className="product-price-rating-container">
                                            <strong className="product-price">${product.price}</strong>
                                            {product.ratingRate && (
                                                <div className="product-rating">
                                                    ⭐ {product.ratingRate} 
                                                    {product.ratingCount && ` (${product.ratingCount})`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {products.length > 0 && (
                <Row className="mt-4">
                    <Col className="text-center">
                        <p className="products-count">
                            Mostrando {products.length} productos
                        </p>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default ListarProductos;