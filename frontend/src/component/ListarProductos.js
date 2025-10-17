// src/component/ListarProductos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import '../Styles/ListarProductos.css';

function ListarProductos() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, []);

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

    // Función para expandir/contraer descripción
    const toggleDescription = (productId, e) => {
        e.stopPropagation();
        setExpandedDescriptions(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Función para determinar si mostrar botón "Ver más"
    const shouldShowReadMore = (description) => {
        return description && description.length > 120;
    };

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
                        Nuestros Productos
                    </h2>
                    <p className="text-center text-muted">
                        Descubre nuestra selección de productos de calidad
                    </p>
                </Col>
            </Row>

            {products.length === 0 ? (
                <Row>
                    <Col>
                        <Alert variant="info" className="text-center">
                            <Alert.Heading>No hay productos</Alert.Heading>
                            <p>No se encontraron productos disponibles.</p>
                        </Alert>
                    </Col>
                </Row>
            ) : (
                <Row className="align-items-stretch">
                    {products.map((product) => (
                        <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex">
                            <Card 
                                className="product-card-listar w-100"
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
                                    className="product-card-image-listar"
                                    onError={(e) => {
                                        e.target.src = getRandomImage(product.id);
                                    }}
                                />
                                <Card.Body className="product-card-body-listar">
                                    {/* Sección superior: Título + Categoría (altura fija) */}
                                    <div className="product-header-section">
                                        <Card.Title
                                            className="product-title-listar"
                                            title={product.title}
                                        >
                                            {truncateTitle(product.title)}
                                        </Card.Title>

                                        <div className="mb-2">
                                            <span
                                                className="badge"
                                                style={{ backgroundColor: '#20B2AA', color: 'white' }}
                                            >
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sección media: Descripción (flexible, crece) */}
                                    <div className="product-description-section-listar">
                                        <Card.Text
                                            className="product-description-text-listar"
                                            style={{ 
                                                display: '-webkit-box',
                                                WebkitLineClamp: expandedDescriptions[product.id] ? 'unset' : '3',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: expandedDescriptions[product.id] ? 'visible' : 'hidden'
                                            }}
                                            title={product.description}
                                        >
                                            {expandedDescriptions[product.id] 
                                                ? product.description 
                                                : truncateText(product.description, 120)
                                            }
                                        </Card.Text>

                                        {shouldShowReadMore(product.description) && (
                                            <button
                                                onClick={(e) => toggleDescription(product.id, e)}
                                                className="read-more-btn-listar"
                                            >
                                                {expandedDescriptions[product.id] ? 'Ver menos' : 'Ver más'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Sección inferior: Precio + Rating (siempre al fondo) */}
                                    <div className="product-footer-section">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <strong className="text-success h5 mb-0">${product.price}</strong>
                                            {product.rating && (
                                                <span className="text-warning small">
                                                    ⭐ {product.rating.rate} ({product.rating.count})
                                                </span>
                                            )}
                                        </div>
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

export default ListarProductos;