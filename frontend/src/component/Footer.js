// src/components/Footer/Footer.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { Envelope, Telephone, GeoAlt, Clock } from 'react-bootstrap-icons';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#20B2AA', color: 'white' }} className="pt-5 pb-3 mt-5">
      <Container>
        <Row className="justify-content-center">
          {/* Columna de Contacto - Centrada y más ancha */}
          <Col lg={8} md={10} className="mb-4">
            <h5 className="mb-4 text-center" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              Contáctanos
            </h5>
            
            <Row>
              <Col md={6} className="mb-4">
                {/* Información de Contacto - Contenido centrado */}
                <div className="text-center text-md-start">
                  {/* Dirección */}
                  <div className="d-flex align-items-center mb-3 justify-content-center justify-content-md-start">
                    <GeoAlt className="me-3" size={24} style={{ color: 'white', minWidth: '24px' }} />
                    <div>
                      <p className="mb-0" style={{ fontWeight: '500' }}>Avenida Siempreviva 742</p>
                      <p className="mb-0">Springfield</p>
                    </div>
                  </div>
                  
                  {/* Teléfono */}
                  <div className="d-flex align-items-center mb-3 justify-content-center justify-content-md-start">
                    <Telephone className="me-3" size={24} style={{ color: 'white', minWidth: '24px' }} />
                    <span style={{ fontWeight: '500' }}>+1 (555) 123-4567</span>
                  </div>
                  
                  {/* Email */}
                  <div className="d-flex align-items-center mb-3 justify-content-center justify-content-md-start">
                    <Envelope className="me-3" size={24} style={{ color: 'white', minWidth: '24px' }} />
                    <span style={{ fontWeight: '500' }}>info@mitienda.com</span>
                  </div>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                {/* Horario de Atención - Contenido centrado */}
                <div className="text-center text-md-start">
                  <div className="d-flex align-items-center mb-3 justify-content-center justify-content-md-start">
                    <Clock className="me-3" size={24} style={{ color: 'white', minWidth: '24px' }} />
                    <div>
                      <h6 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Horario de Atención
                      </h6>
                      <p className="mb-1">Lunes - Viernes: 9:00 - 18:00</p>
                      <p className="mb-0">Sábados: 9:00 - 14:00</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Línea divisoria */}
        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
        
        {/* Copyright */}
        <Row>
          <Col className="text-center">
            <p className="mb-0" style={{ fontWeight: '500' }}>
              &copy; {new Date().getFullYear()} Mi tienda. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;