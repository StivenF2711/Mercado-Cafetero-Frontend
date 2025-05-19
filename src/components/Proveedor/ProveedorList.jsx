import React, { useState } from "react";
import ModalEnviarPedidoProveedor from "./ModalEnviarPedidoProveedor"; // Asegúrate de la ruta correcta

const ProveedorList = ({ proveedores, onEdit, onDelete }) => {
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  const toggleMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const cerrarMenu = () => setMenuAbierto(null);

  const handleContactarClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModalAbierto(true);
    cerrarMenu(); // Cierra el menú al hacer clic en "Contactar"
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setProveedorSeleccionado(null);
  };

  const styles = {
    list: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      alignItems: "center",
    },
    emptyMessage: {
      textAlign: "center",
      color: "#888",
      fontSize: "14px",
    },
    card: {
      backgroundColor: "#1e293b",
      padding: "10px",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "400px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
      color: "#e5e7eb",
      fontSize: "14px",
      position: "relative",
    },
    name: {
      color: "#f9fafb",
      fontWeight: "600",
      fontSize: "16px",
      margin: "5px 0",
    },
    text: {
      margin: "2px 0",
      color: "#cbd5e1",
    },
    menuWrapper: {
      position: "absolute",
      top: "10px",
      right: "10px",
    },
    optionsButton: {
      background: "none",
      border: "none",
      fontSize: "20px",
      color: "#e2e8f0",
      cursor: "pointer",
    },
    menu: {
      position: "absolute",
      top: "30px",
      right: "0px",
      backgroundColor: "#334155",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    menuItem: {
      padding: "10px 16px",
      backgroundColor: "transparent",
      border: "none",
      color: "#f1f5f9",
      textAlign: "left",
      fontSize: "14px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.list}>
      {proveedores.length === 0 ? (
        <p style={styles.emptyMessage}>No hay proveedores registrados.</p>
      ) : (
        proveedores.map((prov) => (
          <div key={prov.id} style={styles.card}>
            <div>
              <h3 style={styles.name}>{prov.nombre}</h3>
              <p style={styles.text}>
                <strong>Categoría:</strong>{" "}
                {prov.categoria_nombre || "No especificada"}
              </p>
              <p style={styles.text}>
                <strong>Teléfono:</strong> {prov.telefono || "No especificado"}
              </p>
              <p style={styles.text}>
                <strong>Email:</strong> {prov.email || "No especificado"}
              </p>
              <p style={styles.text}>
                <strong>Días de visita:</strong>{" "}
                {prov.dias_visita && prov.dias_visita.length > 0
                  ? prov.dias_visita
                  : "No especificados"}
              </p>
            </div>

            <div style={styles.menuWrapper}>
              <button onClick={() => toggleMenu(prov.id)} style={styles.optionsButton}>
                ⋮
              </button>

              {menuAbierto === prov.id && (
                <div style={styles.menu}>
                  <button
                    onClick={() => {
                      onEdit(prov);
                      cerrarMenu();
                    }}
                    style={styles.menuItem}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete(prov.id);
                      cerrarMenu();
                    }}
                    style={{ ...styles.menuItem, color: "#ef4444" }}
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleContactarClick(prov)}
                    style={styles.menuItem}
                  >
                    Contactar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      {modalAbierto && proveedorSeleccionado && (
        <ModalEnviarPedidoProveedor
          proveedor={proveedorSeleccionado}
          onCerrar={handleCerrarModal}
        />
      )}
    </div>
  );
};

export default ProveedorList;