function CategoriaCard({ cat, editarCategoria, setEditarCategoria, actualizarCategoria, eliminarCategoria }) {
    const isEditando = editarCategoria && editarCategoria.id === cat.id;
  
    return (
      <div style={styles.card}>
        {isEditando ? (
          <>
            <input
              type="text"
              value={editarCategoria.nombre}
              onChange={(e) => setEditarCategoria({ ...editarCategoria, nombre: e.target.value })}
              style={styles.input}
            />
            <button onClick={() => actualizarCategoria(cat.id)} style={styles.saveButton}>Guardar</button>
          </>
        ) : (
          <>
            <h3 style={styles.name}>{cat.nombre}</h3>
            <div style={styles.buttonGroup}>
              <button onClick={() => setEditarCategoria(cat)} style={styles.editButton}>Editar</button>
              <button onClick={() => eliminarCategoria(cat.id)} style={styles.deleteButton}>Eliminar</button>
            </div>
          </>
        )}
      </div>
    );
  }
  
const styles = {
  card: {
    backgroundColor: "#1e293b",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px -1px rgba(0, 0, 0, 0.16), 0 1px 3px -1px rgba(0, 0, 0, 0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "200px",       // tamaño fijo ancho para que se acomoden
    marginBottom: "8px",  // espacio vertical entre filas
  },
  input: {
    padding: "7px",             // menos padding
    borderRadius: "4px",
    border: "1px solid #c2c9d6",
    width: "100%",
    backgroundColor: "#f8f9fc",
    color: "#2f3237",
    fontSize: "14px",           // texto más pequeño
  },
  name: {
    color: "#f8f9fc",
    fontWeight: "bold",
    marginBottom: "8px",        // menos margen
    fontSize: "16px",           // texto más pequeño
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",                 // menos separación
    marginTop: "8px",
  },
  editButton: {
    backgroundColor: "#5e636e",
    color: "#fff",
    padding: "7px 12px",        // botones más pequeños
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    color: "#fff",
    padding: "7px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  saveButton: {
    backgroundColor: "#2f3237",
    color: "#fff",
    padding: "7px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
};
  
  export default CategoriaCard;
  