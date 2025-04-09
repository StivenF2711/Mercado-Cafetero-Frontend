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
      backgroundColor: "#1e293b", // fondo slate oscuro (rgb(30, 41, 59))
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.16), 0 1px 4px -1px rgba(0, 0, 0, 0.04)", // --lt-shadowDefault
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #c2c9d6", // --lt-color-gray-400
      width: "100%",
      backgroundColor: "#f8f9fc", // --lt-color-gray-100
      color: "#2f3237", // --lt-color-gray-700
    },
    name: {
      color: "#f8f9fc", // texto claro
      fontWeight: "bold",
      marginBottom: "10px",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    },
    editButton: {
      backgroundColor: "#5e636e", // --lt-color-gray-600
      color: "#fff", // --lt-color-white
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    deleteButton: {
      backgroundColor: "#D32F2F", // color para errores
      color: "#fff",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    saveButton: {
      backgroundColor: "#2f3237", // --lt-color-gray-700
      color: "#fff",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };
  
  
  export default CategoriaCard;
  