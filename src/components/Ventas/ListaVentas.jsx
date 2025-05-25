import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL_VENTAS = "web-production-46688.up.railway.app/api/ventas/";
const API_URL_PRODUCTOS = "web-production-46688.up.railway.app/api/productos/";

const ListaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Consultar productos
        const productosRes = await axios.get(API_URL_PRODUCTOS, {
          headers: { Authorization: `Token ${token}` },
        });
        setProductos(productosRes.data);

        // Consultar ventas
        const ventasRes = await axios.get(API_URL_VENTAS, {
          headers: { Authorization: `Token ${token}` },
        });
        setVentas(ventasRes.data);
      } catch (err) {
        console.error(err);
        setError("Error cargando los datos");
      }
    };

    fetchDatos();
  }, [token]);

  // Función para buscar el nombre del producto por ID
  const obtenerNombreProducto = (idProducto) => {
    const producto = productos.find((p) => p.id === idProducto);
    return producto ? producto.nombre : "Producto desconocido";
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!ventas || ventas.length === 0) {
    return <p>No hay ventas registradas.</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <h2>Lista de Ventas</h2>
      {ventas.map((venta) => {
        const fechaFormateada = venta.fecha
          ? new Date(venta.fecha).toLocaleString()
          : "Fecha no disponible";

        const cliente = venta.id_cliente || venta.cliente || "Anónimo";

        return (
          <div
            key={venta.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "5px",
            }}
          >
            <h3>Venta #{venta.id}</h3>
            <p>
              Cliente: {cliente} <br />
              Fecha: {fechaFormateada} <br />
              Método de pago: {venta.metodo_pago || "No especificado"} <br />
              Estado: {venta.estado || "Desconocido"} <br />
              Observaciones: {venta.observaciones || "-"} <br />
              Total: ${Number(venta.total || 0).toFixed(2)}
            </p>

            <h4>Detalles</h4>
            {venta.detalles && venta.detalles.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                    >
                      Producto
                    </th>
                    <th
                      style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}
                    >
                      Cantidad
                    </th>
                    <th
                      style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}
                    >
                      Precio Unitario
                    </th>
                    <th
                      style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {venta.detalles.map((detalle) => {
                    const nombreProducto = obtenerNombreProducto(detalle.producto);

                    const cantidad = Number(detalle.cantidad) || 0;
                    const precioUnitario = Number(detalle.precio_unitario) || 0;
                    const subtotal = Number(detalle.subtotal) || 0;

                    return (
                      <tr key={detalle.id || Math.random()}>
                        <td>{nombreProducto}</td>
                        <td style={{ textAlign: "right" }}>{cantidad}</td>
                        <td style={{ textAlign: "right" }}>
                          ${precioUnitario.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          ${subtotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No hay detalles para esta venta.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListaVentas;
