import React, { useState } from "react";
import CrearPedido from "../components/Pedidos/CrearPedidoComponent";
import VerPedidos from "../components/Pedidos/VerPedidoComponent";
import RecibirPedidoComponent from "../components/Pedidos/RecibirPedidoComponent";

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "rgb(17, 24, 39)", // fondo oscuro
    paddingTop: "40px",
    boxSizing: "border-box",
  },
  container: {
    backgroundColor: "rgb(30, 41, 59)", // formulario oscuro
    padding: "30px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 6px -1px rgba(0, 0, 0, 0.16), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
    width: "90%",
    maxWidth: "700px",
    color: "#dee3ed", // gris claro para texto
  },
  title: {
    color: "#f8f9fc", // texto claro (gris muy claro)
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background-color 0.3s",
    color: "#f8f9fc",
    backgroundColor: "#5e636e",
  },
  buttonActiveCrear: {
    backgroundColor: "#2563eb", // azul fuerte (similar a bg-blue-600)
  },
  buttonActiveVer: {
    backgroundColor: "#22c55e", // verde brillante (similar a bg-green-600)
  },
};

const Pedidos = () => {
  const [vista, setVista] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const manejarRecibirPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setVista("recibir");
  };

  const volverLista = () => {
    setPedidoSeleccionado(null);
    setVista("ver");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.title}>Gestión de Pedidos</h1>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => setVista("crear")}
            style={{
              ...styles.button,
              ...(vista === "crear" ? styles.buttonActiveCrear : {}),
            }}
          >
            Realizar Pedido
          </button>
          <button
            onClick={() => setVista("ver")}
            style={{
              ...styles.button,
              ...(vista === "ver" ? styles.buttonActiveVer : {}),
            }}
          >
            Ver Pedidos
          </button>
        </div>

        <div>
          {vista === "crear" && <CrearPedido />}
          {vista === "ver" && <VerPedidos onRecibirPedido={manejarRecibirPedido} />}
          {vista === "recibir" && pedidoSeleccionado && (
            <RecibirPedidoComponent pedido={pedidoSeleccionado} onVolver={volverLista} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
