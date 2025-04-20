import React, { useState, useEffect } from "react";

const styles = {
  container: {
    padding: "20px",
    minHeight: "100vh",
    backgroundColor: "#111827",
    color: "#f8f9fc",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    backgroundColor: "#1f2937",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  card: {
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "#f8f9fc",
    fontSize: "16px",
  },
  checkbox: {
    marginLeft: "8px",
    transform: "scale(1.3)",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

const AgregarProducto = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    proveedor: "",
    precio_compra: "",
    precio_venta: "",
    stock: 0,
    unidad_medida: "unidad",
    activo: true,
    imagen: null,
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    // Simulación de llamadas a la API para cargar categorías y proveedores
    // Reemplazar por llamadas reales a tu backend
    setCategorias([
      { id: 1, nombre: "Electrónica" },
      { id: 2, nombre: "Ropa" },
    ]);
    setProveedores([
      { id: 1, nombre: "Proveedor A" },
      { id: 2, nombre: "Proveedor B" },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setProducto({ ...producto, [name]: checked });
    } else if (type === "file") {
      setProducto({ ...producto, imagen: files[0] });
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in producto) {
      formData.append(key, producto[key]);
    }

    console.log("Formulario enviado con:", Object.fromEntries(formData));

    // Aquí enviarías formData a tu backend (ej. usando fetch o axios)
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Agregar Producto</h2>
      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre</label>
            <input style={styles.input} type="text" name="nombre" value={producto.nombre} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categoría</label>
            <select style={styles.input} name="categoria" value={producto.categoria} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Proveedor</label>
            <select style={styles.input} name="proveedor" value={producto.proveedor} onChange={handleChange}>
              <option value="">Sin proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Precio de Compra</label>
            <input style={styles.input} type="number" name="precio_compra" value={producto.precio_compra} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Precio de Venta</label>
            <input style={styles.input} type="number" name="precio_venta" value={producto.precio_venta} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Stock</label>
            <input style={styles.input} type="number" name="stock" value={producto.stock} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Unidad de Medida</label>
            <input style={styles.input} type="text" name="unidad_medida" value={producto.unidad_medida} onChange={handleChange} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Activo
              <input style={styles.checkbox} type="checkbox" name="activo" checked={producto.activo} onChange={handleChange} />
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Imagen</label>
            <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
          </div>

          <button type="submit" style={styles.button}>Guardar Producto</button>
        </form>
      </div>
    </div>
  );
};

export default AgregarProducto;
