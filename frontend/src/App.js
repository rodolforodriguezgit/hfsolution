// src/App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './component/Navbar';
import Header from './component/Header';
import Banners from './component/Banners';
import Footer from './component/Footer';
import ListarProductos from './component/ListarProductos';
import CrearProductos from './component/CrearProductos';
import EliminarProductos from './component/EliminarProductos';
import ActualizarProductos from './component/ActualizarProductos';
import EditarProducto from './component/EditarProducto';
import Categorias from './component/Categorias';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Header />
        
        <Routes>
  
          <Route path="/" element={<Banners />} />
          
          <Route path="/crear-productos" element={<CrearProductos />} />
          <Route path="/listar-productos" element={<ListarProductos />} />
          <Route path="/actualizar-productos" element={<ActualizarProductos />} />
          <Route path="/editar-producto" element={<EditarProducto />} />
          <Route path="/eliminar-productos" element={<EliminarProductos />} />
                <Route path="/categorias" element={<Categorias />} />
          
      
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;