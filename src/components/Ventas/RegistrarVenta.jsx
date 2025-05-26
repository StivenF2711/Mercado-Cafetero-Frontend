import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL_PRODUCTOS = "https://web-production-46688.up.railway.app/api/inventario/productos-disponibles/";
const API_URL_PREFERENCIA = "https://web-production-46688.up.railway.app/api/ventas/crearpreferencia/";

const METODOS_PAGO = [
  { value: "efectivo", label: "Efectivo" },
  { value: "mercadopago", label: "Mercado Pago" },
];

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgb(17, 24, 39)", // fondo oscuro
  },
  loginBox: {
    backgroundColor: "rgb(30, 41, 59)", // formulario oscuro
    padding: "30px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 6px -1px rgba(0, 0, 0, 0.16), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
    width: "90%",
    maxWidth: "600px",
    textAlign: "center",
  },
  title: {
    color: "#f8f9fc", // texto claro (gris muy claro)
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  errorMessage: {
    color: "#D32F2F", // rojo error
    fontWeight: "bold",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  label: {
    display: "block",
    color: "#dee3ed", // gris claro
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    maxWidth: "350px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #c2c9d6",
    outline: "none",
    transition: "border 0.3s",
    backgroundColor: "#f8f9fc",
    color: "#2f3237",
  },
  select: {
    width: "100%",
    maxWidth: "350px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #c2c9d6",
    backgroundColor: "#f8f9fc",
    color: "#2f3237",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    backgroundColor: "#5e636e",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  buttonHover: {
    backgroundColor: "#2f3237",
  },
  detalleContainer: {
    border: "1px solid #5e636e",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "left",
    backgroundColor: "rgb(40, 50, 70)",
    color: "#dee3ed",
  },
  smallText: {
    marginTop: "10px",
    color: "#dee3ed",
  },
  addButton: {
    backgroundColor: "#4b5563",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "20px",
    transition: "background 0.3s",
  },
};

const RegistrarVenta = ({ onVentaCreada }) => {
  const [clienteId, setClienteId] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [detalles, setDetalles] = useState([
    { producto_id: "", cantidad: 1, precio_unitario: 0 },
  ]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(API_URL_PRODUCTOS)
      .then((res) => setProductosDisponibles(res.data))
      .catch(() => setError("Error cargando productos disponibles"));
  }, []);

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][field] = value;

    if (field === "producto_id") {
      const producto = productosDisponibles.find(
        (p) => p.id === parseInt(value)
      );
      nuevosDetalles[index].precio_unitario = producto
        ? parseFloat(producto.precio_venta)
        : 0;
      if (producto) {
        nuevosDetalles[index].cantidad = 1;
      }
    }

    if (field === "cantidad") {
      const producto = productosDisponibles.find(
        (p) => p.id === parseInt(nuevosDetalles[index].producto_id)
      );
      if (producto && value > producto.stock) {
        nuevosDetalles[index].cantidad = producto.stock;
      }
    }

    setDetalles(nuevosDetalles);
  };

  const calcularSubtotal = (detalle) =>
    detalle.cantidad * detalle.precio_unitario;

  const calcularTotal = () =>
    detalles.reduce((acc, d) => acc + calcularSubtotal(d), 0);

  const handleAgregarDetalle = () => {
    setDetalles([
      ...detalles,
      { producto_id: "", cantidad: 1, precio_unitario: 0 },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = calcularTotal();

    if (!metodoPago || detalles.length === 0) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      const payload = {
        id_cliente: clienteId ? clienteId.toString() : null,
        metodo_pago: metodoPago,
        total: total,
        detalles: detalles.map((d) => ({
          producto: parseInt(d.producto_id),
          cantidad: parseInt(d.cantidad),
          precio_unitario: parseFloat(d.precio_unitario),
          subtotal: parseFloat(calcularSubtotal(d)),
        })),
      };

      const response = await axios.post(API_URL_PREFERENCIA, payload, {
        headers: { Authorization: `Token ${token}` },
      });

      setError(null);
      onVentaCreada(response.data);
      alert("Venta registrada con éxito");

      if (metodoPago === "mercadopago" && response.data.init_point) {
        window.open(response.data.init_point, "_blank");
      }

      setClienteId("");
      setMetodoPago("");
      setDetalles([{ producto_id: "", cantidad: 1, precio_unitario: 0 }]);
    } catch (err) {
      console.error("Error al registrar venta:", err.response?.data);
      setError(JSON.stringify(err.response?.data || "Error al registrar la venta"));
    }
  };

  return (
    <div style={styles.pageContainer}>
      <form onSubmit={handleSubmit} style={styles.loginBox}>
        <h2 style={styles.title}>Registrar Venta</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}

        <label style={styles.label}>
          ID Cliente:
          <input
            type="number"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Método de pago:
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">-- Seleccione --</option>
            {METODOS_PAGO.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <h3 style={{ color: "#f8f9fc", marginBottom: "10px" }}>
          Detalles de la venta
        </h3>

        {productosDisponibles.length === 0 && (
          <p style={{ color: "orange" }}>No hay productos disponibles</p>
        )}

        {detalles.map((detalle, i) => (
          <div key={i} style={styles.detalleContainer}>
            <label style={styles.label}>
              Producto:
              <select
                value={detalle.producto_id}
                onChange={(e) =>
                  handleDetalleChange(i, "producto_id", e.target.value)
                }
                required
                style={styles.select}
              >
                <option value="">-- Seleccione producto --</option>
                {productosDisponibles.map((producto) => (
                  <option
                    key={producto.id}
                    value={producto.id}
                    disabled={producto.stock === 0}
                  >
                    {producto.nombre} - Stock: {producto.stock}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Cantidad:
              <input
                type="number"
                min="1"
                max={
                  detalle.producto_id
                    ? productosDisponibles.find(
                        (p) => p.id === parseInt(detalle.producto_id)
                      )?.stock || 1
                    : 1
                }
                value={detalle.cantidad}
                onChange={(e) =>
                  handleDetalleChange(i, "cantidad", e.target.value)
                }
                required
                style={styles.input}
              />
            </label>

            <p style={styles.smallText}>
              Precio unitario: ${detalle.precio_unitario.toFixed(2)}
            </p>
            <p style={styles.smallText}>
              Subtotal: ${calcularSubtotal(detalle).toFixed(2)}
            </p>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAgregarDetalle}
          style={styles.addButton}
        >
          + Agregar producto
        </button>

        <h3 style={{ color: "#f8f9fc" }}>
          Total: ${calcularTotal().toFixed(2)}
        </h3>

        <button type="submit" style={styles.button}>
          Registrar Venta
        </button>
      </form>
    </div>
  );
};

export default RegistrarVenta;
