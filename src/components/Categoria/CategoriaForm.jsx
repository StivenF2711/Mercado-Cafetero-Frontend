function CategoriaForm({ nuevaCategoria, setNuevaCategoria, agregarCategoria }) {
    return (
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={nuevaCategoria.nombre}
          onChange={(e) => setNuevaCategoria({ nombre: e.target.value })}
          style={styles.input}
        />
        <button onClick={agregarCategoria} style={styles.addButton}>
          Agregar
        </button>
      </div>
    );
  }
  const styles = {
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #c2c9d6", // --lt-color-gray-400
      backgroundColor: "#f8f9fc", // --lt-color-gray-100
      color: "#2f3237", // --lt-color-gray-700
      width: "80%",
      maxWidth: "400px",
    },
    addButton: {
      backgroundColor: "#5e636e", // --lt-color-gray-600
      color: "white", // --lt-color-white
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      border: "none",
      transition: "background 0.3s",
    },
  };
  
  
  export default CategoriaForm;
  