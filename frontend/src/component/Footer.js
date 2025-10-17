
import { Container, Row, Col } from 'react-bootstrap';
import { Envelope, Telephone, GeoAlt, Clock } from 'react-bootstrap-icons';
import '../Styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10} className="footer-main-col">
            <h5 className="footer-title text-center">Contáctanos</h5>

            <Row className="justify-content-center">

              <Col md={6} className="footer-col">
                <div className="footer-info text-center text-md-start">
         
                  <div className="footer-item">
                    <GeoAlt className="footer-icon" size={24} />
                    <div>
                      <p className="footer-text-bold">Avenida Siempreviva 742</p>
                      <p className="footer-text">Springfield</p>
                    </div>
                  </div>

                  <div className="footer-item">
                    <Telephone className="footer-icon" size={24} />
                    <span className="footer-text-bold">+1 (555) 123-4567</span>
                  </div>

          
                  <div className="footer-item">
                    <Envelope className="footer-icon" size={24} />
                    <span className="footer-text-bold">info@mitienda.com</span>
                  </div>
                </div>
              </Col>

              <Col md={6} className="footer-col">
                <div className="footer-info text-center text-md-start">
                  <div className="footer-item">
                    <Clock className="footer-icon" size={24} />
                    <div>
                      <h6 className="footer-subtitle">Horario de Atención</h6>
                      <p className="footer-text">Lunes - Viernes: 9:00 - 18:00</p>
                      <p className="footer-text">Sábados: 9:00 - 14:00</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

 
        <hr className="footer-divider" />

  
        <Row>
          <Col className="text-center">
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} Mi tienda. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
