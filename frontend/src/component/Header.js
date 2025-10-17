// src/components/Banner/Banner.jsx
import { Container } from 'react-bootstrap';

function Header({ 
  imageUrl = "/banner.png", 
  altText = "Banner principal",
  height = "60vh", // Usar unidades relativas
  minHeight = "400px"
}) {
  return (
    <Container fluid className="p-0">
      <div 
        className="banner-background"
        style={{
          width: '100%',
          height: height,
          minHeight: minHeight,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        role="img"
        aria-label={altText}
      />
    </Container>
  );
}

export default Header;