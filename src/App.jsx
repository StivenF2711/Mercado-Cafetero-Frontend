import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Proveedores from "./pages/Proveedores.jsx";
import PrivateRoute from "./components/PrivateRoute";
import Categorias from "./pages/Categorias.jsx";
import Inventario from "./pages/Inventario.jsx"; // Importa tu componente de inventario
import Producto from "./pages/Producto.jsx"; // Importa tu componente de producto
import Transacciones from "./pages/Transacciones.jsx"; // Importa tu componente de entradas y salidas
import ContartarProv from "./pages/ContactarProv.jsx"; // Importa tu componente de contactar proveedor

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con Navbar */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/proveedores"
            element={
              <>
                <Navbar />
                <Proveedores />
              </>
            }
          />
          <Route
            path="/categorias"
            element={
              <>
                <Navbar />
                <Categorias />
              </>
            }
          />
          <Route
            path="/inventario"
            element={
              <>
                <Navbar />
                <Inventario />
              </>
            }
          />
          <Route
            path="/transacciones"
            element={
              <>
                <Navbar />
                <Transacciones />
              </>
            }
          />
          <Route
            path="/contactar/:id"
            element={
              <>
                <Navbar />
                <ContartarProv />
              </>
            }
          />
        </Route>
        
        <Route
          path="/producto"
            element={
              <>
                <Navbar />
                <Producto />
            </>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
