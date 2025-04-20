// src/components/Producto/ProductoList.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://mercado-cafetero-backend-production.up.railway.app";

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    obtenerProductos(token);
  }, []);

  const obtenerProductos = (token) => {
    axios
      .get(`${API_URL}/api/productos/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  };

  const toggleMenu = (id) => {
    setMenuAbierto((prev) => (prev === id ? null : id));
  };

  const eliminarProducto = (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    axios
      .delete(`${API_URL}/api/productos/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => obtenerProductos(token))
      .catch((error) => {
        console.error("Error al eliminar:", error.response?.data || error);
      });
  };

  const styles = {
    menuButton: {
      background: "transparent",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
    },
    menuDesplegable: {
      position: "absolute",
      top: "30px",
      right: "0",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "5px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      zIndex: 100,
    },
    menuItem: {
      display: "block",
      width: "100%",
      padding: "10px",
      textAlign: "left",
      border: "none",
      background: "none",
      cursor: "pointer",
    },
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.categoria_nombre}</td>
              <td>{producto.proveedor_nombre}</td>
              <td>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => toggleMenu(producto.id)}
                    style={styles.menuButton}
                  >
                    ⋯
                  </button>
                  {menuAbierto === producto.id && (
                    <div style={styles.menuDesplegable}>
                      <button
                        onClick={() => navigate(`/editar-producto/${producto.id}`)}
                        style={styles.menuItem}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        style={{ ...styles.menuItem, color: "red" }}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoList;
