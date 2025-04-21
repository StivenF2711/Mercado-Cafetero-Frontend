import { useState, useEffect } from "react";

const InventarioForm = ({ onSubmit, productos, proveedorOptions, movimientoActual }) => {
  const [formData, setFormData] = useState({
    producto: "",
    proveedor: "",
    tipo: "entrada",
    cantidad: 0,
    observaciones: "",
  });

  const [error, setError] = useState("");  // Manejo de errores

  useEffect(() => {
    if (movimientoActual) {
      setFormData({ ...movimientoActual });
    }
  }, [movimientoActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setError("");  // Limpiar el error cuando se edita el formulario
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.producto || !formData.proveedor) {
      setError("Por favor, selecciona un producto y un proveedor.");
      return;
    }

    onSubmit(formData);
    setFormData({ producto: "", proveedor: "", tipo: "entrada", cantidad: 0, observaciones: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.header}>{movimientoActual ? "Editar Movimiento" : "Agregar Movimiento"}</h3>

      {error && <p style={styles.error}>{error}</p>} {/* Mostrar mensaje de error */}

      <select
        name="producto"
        value={formData.producto}
        onChange={handleChange}
        required
        style={styles.select}
      >
        <option value="">Selecciona un producto</option>
        {Array.isArray(productos) && productos.length > 0 ? (
          productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))
        ) : (
          <option>No hay productos disponibles</option>
        )}
      </select>

      <select
        name="proveedor"
        value={formData.proveedor}
        onChange={handleChange}
        style={styles.select}
      >
        <option value="">Selecciona un proveedor</option>
        {Array.isArray(proveedorOptions) && proveedorOptions.length > 0 ? (
          proveedorOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))
        ) : (
          <option>No hay proveedores disponibles</option>
        )}
      </select>

      <select name="tipo" value={formData.tipo} onChange={handleChange} style={styles.select}>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>

      <input
        type="number"
        name="cantidad"
        value={formData.cantidad}
        onChange={handleChange}
        placeholder="Cantidad"
        required
        style={styles.input}
      />

      <textarea
        name="observaciones"
        value={formData.observaciones}
        onChange={handleChange}
        placeholder="Observaciones"
        style={styles.textarea}
      />

      <button type="submit" style={styles.button}>
        {movimientoActual ? "Actualizar" : "Agregar"}
      </button>
    </form>
  );
};

const styles = {
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      margin: "0 auto 16px",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#1f2937", // gris oscuro
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)", // sombra media
    },
    header: {
      color: "#f8f9fc", // texto muy claro
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "center",
    },
    select: {
      padding: "10px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "1px solid #4b5563", // gris intermedio
      backgroundColor: "#1e293b", // slate oscuro
      color: "#e5e7eb", // texto claro
      width: "100%",
    },
    input: {
      padding: "10px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "1px solid #4b5563",
      backgroundColor: "#1e293b",
      color: "#e5e7eb",
      width: "100%",
    },
    textarea: {
      padding: "10px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "1px solid #4b5563",
      backgroundColor: "#1e293b",
      color: "#e5e7eb",
      width: "100%",
      height: "100px",
    },
    button: {
      backgroundColor: "#3b82f6", // azul principal
      color: "#ffffff", // texto claro
      padding: "12px",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
      border: "none",
      transition: "background-color 0.3s",
    },
    error: {
      color: "red",
      fontSize: "14px",
      textAlign: "center",
    },
  };
export default InventarioForm;
