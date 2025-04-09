import React from "react";

const ProveedorList = ({ proveedores, onEdit, onDelete }) => {
  return (
    <div style={styles.list}>
      {proveedores.length === 0 ? (
        <p style={styles.emptyMessage}>No hay proveedores registrados.</p>
      ) : (
        proveedores.map((prov) => (
          <div key={prov.id} style={styles.card}>
            <h3 style={styles.name}>{prov.nombre}</h3>
            <p style={styles.text}>
              <strong>Categoría:</strong> {prov.categoria_nombre || "No especificada"}
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
                ? prov.dias_visita.join(", ")
                : "No especificados"}
            </p>
            <div style={styles.buttonGroup}>
              <button onClick={() => onEdit(prov)} style={styles.editButton}>
                Editar
              </button>
              <button onClick={() => onDelete(prov.id)} style={styles.deleteButton}>
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  list: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center", // centrado
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888",
    fontSize: "14px",
  },
  card: {
    backgroundColor: "#1e293b", // dark slate
    padding: "10px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    color: "#e5e7eb",
    fontSize: "14px",
  },
  name: {
    color: "#f9fafb",
    fontWeight: "600",
    fontSize: "16px",
    margin: "5px 0",
  },
  text: {
    margin: "2px 0",
    color: "#cbd5e1", // gris claro
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "10px",
  },
  editButton: {
    backgroundColor: "#3b82f6", // azul minimalista
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
  },
  deleteButton: {
    backgroundColor: "#ef4444", // rojo minimalista
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
  },
};

export default ProveedorList;
