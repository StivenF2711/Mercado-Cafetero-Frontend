import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "rgb(17, 24, 39)", // fondo oscuro
    padding: "40px 0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    backgroundColor: "rgb(30, 41, 59)", // caja oscura
    padding: "30px 40px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 6px -1px rgba(0, 0, 0, 0.16), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
    maxWidth: "900px",
    width: "90%",
    color: "#dee3ed", // texto gris claro
  },
  heading: {
    textAlign: "center",
    color: "#f8f9fc", // texto claro
    marginBottom: "30px",
    fontSize: "2rem",
    fontWeight: "700",
  },
  ventaCard: {
    border: "1px solid #44556f",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "rgb(23, 31, 48)", // fondo de cada venta
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  },
  ventaInfo: {
    marginBottom: "8px",
    color: "#cfd9e6",
  },
  detallesTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "12px",
    color: "#dee3ed",
  },
  th: {
    borderBottom: "2px solid #3b82f6",
    textAlign: "left",
    padding: "8px",
    backgroundColor: "rgb(36, 59, 99)", // azul oscuro tabla
    color: "#3b82f6", // azul brillante encabezados
  },
  td: {
    borderBottom: "1px solid #44556f",
    padding: "8px",
  },
  btnDevolver: (estado) => ({
    padding: "10px 16px",
    backgroundColor: estado === "devuelta" ? "#6c757d" : "#dc3545",
    color: "#f8f9fc",
    border: "none",
    borderRadius: "6px",
    cursor: estado === "devuelta" ? "not-allowed" : "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
    marginBottom: "8px",
  }),
  desplegableContainer: {
    marginTop: "10px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid #44556f",
    backgroundColor: "rgb(23, 31, 48)",
    color: "#dee3ed",
    fontSize: "1rem",
    flexGrow: 1,
  },
  btnConfirmar: {
    padding: "8px 14px",
    backgroundColor: "#28a745",
    color: "#f8f9fc",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
    flexShrink: 0,
  },
};

const ListaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [razones, setRazones] = useState({});
  const [mostrarDesplegable, setMostrarDesplegable] = useState({});
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

    let tipoMovimiento = "";
    if (razon === "devolucion") tipoMovimiento = "devolución";
    else if (razon === "daño") tipoMovimiento = "devolución_daño";
    else if (razon === "vencimiento") tipoMovimiento = "devolución_vencimiento";
    else {
      alert("Razón inválida.");
      return;
    }

    try {
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

      setRazones((prev) => ({ ...prev, [venta.id]: "" }));
      setMostrarDesplegable((prev) => ({ ...prev, [venta.id]: false }));

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
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Lista de Ventas</h2>
        {ventas.map((venta) => (
          <div key={venta.id} style={styles.ventaCard}>
            <p style={styles.ventaInfo}>
              <strong>ID:</strong> {venta.id}
            </p>
            <p style={styles.ventaInfo}>
              <strong>Fecha:</strong> {venta.fecha}
            </p>
            <p style={styles.ventaInfo}>
              <strong>Total:</strong> ${venta.total}
            </p>
            <h4 style={{ color: "#f8f9fc" }}>Detalles:</h4>
            {venta.detalles && venta.detalles.length > 0 ? (
              <table style={styles.detallesTable}>
                <thead>
                  <tr>
                    <th style={styles.th}>Producto</th>
                    <th style={styles.th}>Cantidad</th>
                    <th style={styles.th}>Precio Unitario</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td style={styles.td}>
                        {detalle.nombre_producto || detalle.producto}
                      </td>
                      <td style={styles.td}>{detalle.cantidad}</td>
                      <td style={styles.td}>${detalle.precio_unitario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay detalles para esta venta.</p>
            )}

            <button
              onClick={() => toggleDesplegable(venta.id)}
              disabled={venta.estado === "devuelta"}
              style={styles.btnDevolver(venta.estado)}
            >
              {venta.estado === "devuelta" ? "Devuelta" : "Devolver"}
            </button>

            {mostrarDesplegable[venta.id] && venta.estado !== "devuelta" && (
              <div style={styles.desplegableContainer}>
                <select
                  value={razones[venta.id] || ""}
                  onChange={(e) => handleSeleccion(venta.id, e.target.value)}
                  style={styles.select}
                >
                  <option value="">Selecciona razón</option>
                  <option value="devolucion">Devolución normal</option>
                  <option value="daño">Daño</option>
                  <option value="vencimiento">Vencimiento</option>
                </select>
                <button
                  onClick={() => hacerDevolucion(venta)}
                  style={styles.btnConfirmar}
                >
                  Confirmar devolución
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaVentas;
