import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VerificarPedido() {
  const { id } = useParams(); // obtiene el id del pedido de la URL
  const navigate = useNavigate();

  const [verificado, setVerificado] = useState(false);

  const completarPedido = () => {
    // Aquí podrías hacer una petición a la API para marcar como verificado
    console.log("Pedido verificado:", id);
    setVerificado(true);
  };

  const volver = () => {
    navigate("/pedidos-pendientes");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.titulo}>{verificado ? "Pedido Verificado" : "Verificar Pedido"}</h1>

      <div style={styles.card}>
        <p><strong>ID del pedido:</strong> {id}</p>
        <p><strong>Producto:</strong> Ejemplo producto</p>
        <p><strong>Cantidad:</strong> 10 unidades</p>

        {!verificado ? (
          <button style={styles.botonAzul} onClick={completarPedido}>
            Completar
          </button>
        ) : (
          <p style={{ color: "green", fontWeight: "bold" }}>¡Pedido verificado exitosamente!</p>
        )}

        <button style={styles.botonSecundario} onClick={volver}>
          Volver
        </button>
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
    fontSize: "26px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#fff",
    maxWidth: "500px",
    margin: "0 auto",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },
  botonAzul: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 10,
  },
  botonSecundario: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "8px 16px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    marginTop: 15,
    cursor: "pointer",
  },
};

export default VerificarPedido;
