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
      border: "1px solid #ccc",
      width: "80%",
      maxWidth: "400px",
    },
    addButton: {
      backgroundColor: "#28A745",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };
  
  export default CategoriaForm;
  