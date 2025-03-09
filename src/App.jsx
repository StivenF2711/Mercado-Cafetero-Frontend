import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Proveedores from "./pages/proveedores";
import PrivateRoute from "./components/PrivateRoute";
import Categorias from "./pages/categorias";

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
          </Route>
  
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }
export default App;
