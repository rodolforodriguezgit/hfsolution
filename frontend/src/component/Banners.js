// src/components/AlternatingSections/AlternatingSections.jsx
import { Container, Row, Col, Image } from 'react-bootstrap';

function Banners() {
  const sections = [
    {
      imageUrl: "uno.png",
      title: "Moda y Estilo para Todos",
    text: "Descubre nuestra exclusiva colección de ropa casual y formal. Desde los últimos diseños urbanos hasta elegantes outfits para ocasiones especiales. Calidad premium y tendencias actuales.",


    },
    {
      imageUrl: "dos.png",
      title: "Tecnología y Computación",
    text: "Encuentra los mejores componentes de computación, laptops gaming, accesorios tecnológicos y equipos de última generación. Mejora tu setup con productos de primeras marcas.",
 
 
    }
  ];

  return (
    <Container className="my-5">
      {sections.map((section, index) => {
        const isReversed = index % 2 !== 0;
        
        return (
          <Row key={index} className="align-items-center py-5">
      
            <Col 
              md={6} 
              className={`mb-4 mb-md-0 ${isReversed ? 'order-md-2' : ''}`}
            >
              <Image
                src={section.imageUrl}
                alt={section.title}
                fluid
                rounded
                style={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Col>

            <Col 
              md={6} 
              className={`${isReversed ? 'order-md-1' : ''}`}
            >
              <div className={`p-4 ${isReversed ? 'text-md-end' : 'text-md-start'}`}>
                <h2 className="mb-4" style={{ color: '#20B2AA' }}>{section.title}</h2>
                <p className="mb-4 fs-5 text-secondary">{section.text}</p>

              </div>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
}

export default Banners;