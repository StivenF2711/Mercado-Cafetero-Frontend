import React, { useEffect, useState } from "react";
import axios from "axios";

const ListaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [razones, setRazones] = useState({}); // Almacena razón por venta
  const [mostrarDesplegable, setMostrarDesplegable] = useState({}); // Mostrar select por venta
  const token = localStorage.getItem("token");

  useEffect(() => {
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    try {
      const response = await axios.get(
        "https://web-production-46688.up.railway.app/api/ventas/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setVentas(response.data);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  };

  const hacerDevolucion = async (venta) => {
    const razon = razones[venta.id];
    if (!razon) {
      alert("Selecciona una razón para la devolución.");
      return;
    }

    // Mapear razón a tipo_movimiento válido para backend
    let tipoMovimiento = "";
    if (razon === "devolucion") tipoMovimiento = "devolución";
    else if (razon === "daño") tipoMovimiento = "devolución_daño";
    else if (razon === "vencimiento") tipoMovimiento = "devolución_vencimiento";
    else {
      alert("Razón inválida.");
      return;
    }

    try {
      // Para cualquiera de los tipos, se suma al inventario con el tipo correcto
      for (const detalle of venta.detalles) {
        await axios.post(
          "https://web-production-46688.up.railway.app/api/inventario/",
          {
            producto: detalle.producto,
            tipo: tipoMovimiento,
            cantidad: detalle.cantidad,
            observaciones: `Devolución por ${razon} de la venta #${venta.id}`,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }

      // Actualizar estado de la venta a "devuelta"
      await axios.patch(
        `https://web-production-46688.up.railway.app/api/ventas/${venta.id}/devolver/`,
        { razon_devolucion: razon },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert(`Devolución registrada para la venta #${venta.id}`);

      // Limpiar select y ocultar desplegable
      setRazones((prev) => ({ ...prev, [venta.id]: "" }));
      setMostrarDesplegable((prev) => ({ ...prev, [venta.id]: false }));

      // Refrescar lista para actualizar estados
      obtenerVentas();
    } catch (error) {
      console.error("Error al realizar la devolución:", error);
      alert("No se pudo realizar la devolución.");
    }
  };

  const toggleDesplegable = (ventaId) => {
    setMostrarDesplegable((prev) => ({
      ...prev,
      [ventaId]: !prev[ventaId],
    }));
  };

  const handleSeleccion = (ventaId, valor) => {
    setRazones((prev) => ({
      ...prev,
      [ventaId]: valor,
    }));
  };

  return (
    <div>
      <h2>Lista de Ventas</h2>
      {ventas.map((venta) => (
        <div
          key={venta.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>ID:</strong> {venta.id}
          </p>
          <p>
            <strong>Fecha:</strong> {venta.fecha}
          </p>
          <p>
            <strong>Total:</strong> ${venta.total}
          </p>
          <h4>Detalles:</h4>
          {venta.detalles && venta.detalles.length > 0 ? (
            <table style={{ width: "100%", marginBottom: "10px" }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                </tr>
              </thead>
              <tbody>
                {venta.detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.nombre_producto || detalle.producto}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${detalle.precio_unitario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay detalles para esta venta.</p>
          )}

          {/* Botón para mostrar desplegable y hacer devolución */}
          <button
            onClick={() => toggleDesplegable(venta.id)}
            disabled={venta.estado === "devuelta"}
            style={{
              padding: "8px 12px",
              backgroundColor:
                venta.estado === "devuelta" ? "#6c757d" : "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: venta.estado === "devuelta" ? "not-allowed" : "pointer",
              marginBottom: "8px",
            }}
          >
            {venta.estado === "devuelta" ? "Devuelta" : "Devolver"}
          </button>

          {mostrarDesplegable[venta.id] && venta.estado !== "devuelta" && (
            <div style={{ marginTop: "10px" }}>
              <select
                value={razones[venta.id] || ""}
                onChange={(e) => handleSeleccion(venta.id, e.target.value)}
                style={{ padding: "6px", marginRight: "10px" }}
              >
                <option value="">Selecciona razón</option>
                <option value="devolucion">Devolución normal</option>
                <option value="daño">Daño</option>
                <option value="vencimiento">Vencimiento</option>
              </select>
              <button
                onClick={() => hacerDevolucion(venta)}
                style={{
                  padding: "6px 10px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Confirmar devolución
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaVentas;
