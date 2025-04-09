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
      backgroundColor: "#FFF8E1",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "100%",
    },
    name: {
      color: "#5B3A29",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    },
    editButton: {
      backgroundColor: "#FFA500",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    deleteButton: {
      backgroundColor: "#DC3545",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    saveButton: {
      backgroundColor: "#007BFF",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };
  
  export default CategoriaCard;
  