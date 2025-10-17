// src/component/EliminarProductos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';

function EliminarProductos() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            setDeleting(true);


            const response = await fetch(`http://localhost:5000/products/${productToDelete.id}`, {
                method: 'DELETE'
            });

            const result = await response.json();


            if (result.success || response.ok) {
                setSuccess(true);
                // Remover el producto de la lista
                setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
                // Ocultar modal después de un breve delay
                setTimeout(() => {
                    setShowModal(false);
                    setProductToDelete(null);
                    setSuccess(false);
                }, 1500);
            } else {
                setError(result.error || 'Error al eliminar el producto');
            }
        } catch (err) {
            console.error('💥 Error eliminando producto:', err);
            setError('Error al conectar con el servidor');
        } finally {
            setDeleting(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProductToDelete(null);
        setError(null);
        setSuccess(false);
    };

    // Función para obtener imagen aleatoria (misma que en ListarProductos)
    const getRandomImage = (productId) => {
        const imageServices = [
            `https://picsum.photos/id/237/200/300`
        ];
        return imageServices[productId % imageServices.length];
    };

    const cardStyle = {
        border: 'none',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        transition: 'transform 0.2s ease-in-out'
    };

    const deleteButtonStyle = {
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
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
                        Eliminar Productos
                    </h2>
                    <p className="text-center text-muted">
                        Selecciona un producto que dese eliminar
                    </p>
                </Col>
            </Row>

            {products.length === 0 ? (
                <Row>
                    <Col>
                        <Alert variant="info" className="text-center">
                            <Alert.Heading>No hay productos</Alert.Heading>
                            <p>No se encontraron productos para eliminar.</p>
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
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(product)}
                                            style={deleteButtonStyle}
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#c82333';
                                                e.target.style.borderColor = '#c82333';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = '#dc3545';
                                                e.target.style.borderColor = '#dc3545';
                                            }}
                                        >
                                            🗑️ Eliminar Producto
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#dc3545' }}>
                        ⚠️ Confirmar Eliminación
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {success ? (
                        <Alert variant="success" className="text-center">
                            <Alert.Heading>¡Producto eliminado!</Alert.Heading>
                            <p>El producto ha sido eliminado exitosamente.</p>
                        </Alert>
                    ) : (
                        <>
                            <p>¿Estás seguro de que quieres eliminar este producto?</p>
                            {productToDelete && (
                                <div className="border rounded p-3 bg-light">
                                    <h6>{productToDelete.title}</h6>
                                    <p className="text-muted mb-1">
                                        <strong>Categoría:</strong> {productToDelete.category}
                                    </p>
                                    <p className="text-muted mb-0">
                                        <strong>Precio:</strong> ${productToDelete.price}
                                    </p>
                                </div>
                            )}
                            <Alert variant="warning" className="mt-3">
                                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer.
                            </Alert>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!success && (
                        <>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                style={deleteButtonStyle}
                            >
                                {deleting ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Eliminando...
                                    </>
                                ) : (
                                    'Sí, Eliminar'
                                )}
                            </Button>
                        </>
                    )}
                    {success && (
                        <Button variant="success" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default EliminarProductos;
