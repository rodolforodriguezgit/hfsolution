import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

import '../Styles/Navbar.css';

function NavBar() {
  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand href="#home" className="navbar-brand-custom">
          Mi Tienda
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link  as={Link} to="/" className="nav-link-custom">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/crear-productos" className="nav-link-custom">Crear productos</Nav.Link>
            <Nav.Link as={Link} to="/listar-productos"  className="nav-link-custom">Listar productos</Nav.Link>
            <Nav.Link as={Link} to="/actualizar-productos" className="nav-link-custom">Actualizar productos</Nav.Link>
            <Nav.Link as={Link} to="/eliminar-productos" className="nav-link-custom">Eliminar productos</Nav.Link>
             <Nav.Link as={Link} to="/categorias" className="nav-link-custom">Ctegorias</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
