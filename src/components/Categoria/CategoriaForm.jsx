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
    gap: "12px", // espacio entre el input y el botón
    maxWidth: "300px", // puedes ajustar este valor
    margin: "0 auto", // centra el form horizontalmente si quieres
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    fontFamily: "Poppins, sans-serif",
  },
  addButton: {
    width: "106%",  
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s",
  },
};

export default CategoriaForm;
