import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://mercado-cafetero-backend-production.up.railway.app";

function RetirarInventario() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/");
    obtenerProductos(token);
  }, []);

  const obtenerProductos = (token) => {
    axios
      .get(`${API_URL}/api/productos/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  };

  const manejarRetiro = (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token || !productoSeleccionado) return;

    const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
    if (!producto) return;

    const nuevaCantidad = producto.cantidad - cantidad;
    if (nuevaCantidad < 0) {
      setMensaje("No puedes retirar más productos de los que hay en inventario.");
      return;
    }

    // Actualizar producto en backend
    axios
      .put(`${API_URL}/api/productos/${producto.id}/`, {
        ...producto,
        cantidad: nuevaCantidad,
      }, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        }
      })
      .then(() => {
        setMensaje("Producto actualizado correctamente.");
        obtenerProductos(token);
      })
      .catch((err) => {
        console.error("Error al retirar:", err);
        setMensaje("Error al actualizar el inventario.");
      });
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.titulo}>Retirar producto del inventario</h2>
      <form onSubmit={manejarRetiro} style={styles.form}>
        <label style={styles.label}>Producto:</label>
        <select
          style={styles.select}
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          required
        >
          <option value="">Selecciona un producto</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre} (Disponible: {producto.cantidad})
            </option>
          ))}
        </select>

        <label style={styles.label}>Cantidad a retirar:</label>
        <input
          type="number"
          min="1"
          style={styles.input}
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
          required
        />

        <button type="submit" style={styles.boton}>
          Retirar
        </button>

        {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
      </form>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  titulo: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    maxWidth: "400px",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    borderRadius: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    borderRadius: "5px",
  },
  boton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "10px",
    width: "100%",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mensaje: {
    marginTop: "15px",
    textAlign: "center",
    color: "#111827",
  },
};

export default RetirarInventario;
