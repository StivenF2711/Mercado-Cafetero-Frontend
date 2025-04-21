import React from "react";
import { useNavigate } from "react-router-dom";

const pedidosEjemplo = [
  { id: 1, producto: "Arroz", cantidad: 10, estado: "pendiente" },
  { id: 2, producto: "Frijoles", cantidad: 5, estado: "pendiente" },
];

function PedidosPendientes() {
  const navigate = useNavigate();

  const manejarVerificar = (idPedido) => {
    // Aquí puedes pasar el ID como parámetro o guardarlo en estado global
    navigate(`/verificar-pedido/${idPedido}`);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.titulo}>Pedidos Pendientes</h1>
      <div style={styles.contenedor}>
        {pedidosEjemplo.map((pedido) => (
          <div key={pedido.id} style={styles.card}>
            <div>
              <strong>Producto:</strong> {pedido.producto}
            </div>
            <div>
              <strong>Cantidad:</strong> {pedido.cantidad}
            </div>
            <div>
              <strong>Estado:</strong> {pedido.estado}
            </div>
            <button style={styles.boton} onClick={() => manejarVerificar(pedido.id)}>
              Verificar pedido
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 30,
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  titulo: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
  },
  contenedor: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },
  boton: {
    marginTop: 10,
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default PedidosPendientes;
