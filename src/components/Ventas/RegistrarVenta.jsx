import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL_VENTAS = "https://web-production-46688.up.railway.app/api/ventas/";
const API_URL_PRODUCTOS = "https://web-production-46688.up.railway.app/api/inventario/productos-disponibles/";
const API_URL_PREFERENCIA = "https://web-production-46688.up.railway.app/api/ventas/crear-preferencia/";

const METODOS_PAGO = [
  { value: "efectivo", label: "Efectivo" },
  { value: "mercadopago", label: "Mercado Pago" },
];

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
      // 1. Registrar la venta
      const response = await axios.post(
        API_URL_VENTAS,
        {
          id_cliente: clienteId ? clienteId.toString() : null,
          metodo_pago: metodoPago,
          total: total,
          detalles: detalles.map((d) => ({
            producto: parseInt(d.producto_id),
            cantidad: parseInt(d.cantidad),
            precio_unitario: parseFloat(d.precio_unitario),
            subtotal: parseFloat(calcularSubtotal(d)),
          })),
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      setError(null);
      onVentaCreada(response.data);
      alert("Venta registrada con éxito");

      // 2. Si el método es mercadopago, crear preferencia y abrir pasarela
      if (metodoPago === "mercadopago") {
        try {
          // Construir items para la preferencia
          const items = detalles.map((d) => ({
            id: d.producto_id,
            title: `Producto ${d.producto_id}`,
            quantity: Number(d.cantidad),
            unit_price: Number(d.precio_unitario),
          }));

          const prefResponse = await axios.post(
            API_URL_PREFERENCIA,
            { items },
            { headers: { Authorization: `Token ${token}` } }
          );

          const { init_point } = prefResponse.data;

          // Abrir la pasarela en una nueva pestaña
          window.open(init_point, "_blank");
        } catch (err) {
          console.error("Error creando preferencia de pago:", err);
          alert("La venta se registró, pero hubo un error al iniciar el pago.");
        }
      }

      // 3. Reiniciar formulario
      setClienteId("");
      setMetodoPago("");
      setDetalles([{ producto_id: "", cantidad: 1, precio_unitario: 0 }]);
    } catch (err) {
      console.error("Error al registrar venta:", err.response?.data);
      setError(JSON.stringify(err.response?.data || "Error al registrar la venta"));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Registrar Venta</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        ID Cliente:
        <input
          type="number"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
        />
      </label>

      <label>
        Método de pago:
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          required
        >
          <option value="">-- Seleccione --</option>
          {METODOS_PAGO.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <h3>Detalles de la venta</h3>

      {productosDisponibles.length === 0 && (
        <p style={{ color: "orange" }}>No hay productos disponibles</p>
      )}

      {detalles.map((detalle, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <label>
            Producto:
            <select
              value={detalle.producto_id}
              onChange={(e) =>
                handleDetalleChange(i, "producto_id", e.target.value)
              }
              required
            >
              <option value="">-- Seleccione producto --</option>
              {productosDisponibles.map((producto) => (
                <option
                  key={producto.id}
                  value={producto.id.toString()}
                  disabled={producto.stock === 0}
                >
                  {producto.nombre} - ${parseFloat(producto.precio_venta).toFixed(2)} (
                  {producto.stock} disponibles)
                </option>
              ))}
            </select>
          </label>

          <label>
            Cantidad:
            <input
              type="number"
              min="1"
              value={detalle.cantidad}
              onChange={(e) =>
                handleDetalleChange(i, "cantidad", Math.max(1, Number(e.target.value)))
              }
              required
            />
          </label>

          <p>
            Precio unitario: ${detalle.precio_unitario.toFixed(2)} <br />
            Subtotal: ${calcularSubtotal(detalle).toFixed(2)}
          </p>
        </div>
      ))}

      <button type="button" onClick={handleAgregarDetalle}>
        + Agregar producto
      </button>

      <h3>Total: ${calcularTotal().toFixed(2)}</h3>

      <button type="submit">Realizar Pago</button>
    </form>
  );
};

export default RegistrarVenta;
