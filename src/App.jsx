import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Proveedores from "./pages/Proveedores.jsx";
import PrivateRoute from "./components/PrivateRoute";
import Categorias from "./pages/Categorias.jsx";
import Inventario from "./pages/Inventario.jsx"; // Importa tu componente de inventario
import Producto from "./pages/Producto.jsx"; // Importa tu componente de producto
import Pedidos from "./pages/Pedidos.jsx"; // Importa tu componente de pedidos
import Ventas from "./pages/Ventas.jsx"; // Importa tu componente de ventas
import PagoExitoso from "../components/pagos/PagoExitoso";
import PagoFallido from "../components/pagos/PagoFallido";
import PagoPendiente from "../components/pagos/PagoPendiente";

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
        </Route>
        <Route
            path="/Pedido"
            element={
              <>
                <Navbar />
                <Pedidos />
              </>
            }
          />
        <Route
          path="/producto"
            element={
              <>
                <Navbar />
                <Producto />
            </>
          }
        />
        <Route
          path="/ventas"
            element={
              <>
                <Navbar />
                <Ventas />
              </>
            }
          />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pago-fallido" element={<PagoFallido />} />
        <Route path="/pago-pendiente" element={<PagoPendiente />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
