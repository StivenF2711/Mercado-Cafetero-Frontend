import React, { useState, useEffect } from "react";
import InventarioList from "./InventarioList";
import InventarioForm from "./InventarioForm";
import axios from "axios";


const InventarioPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [movimientoEditando, setMovimientoEditando] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [movRes, prodRes, catRes, provRes] = await Promise.all([
        axios.get("/api/inventario/"),
        axios.get("/api/productos/"),
        axios.get("/api/categorias/"),
        axios.get("/api/proveedores/"),
      ]);
      console.log("Productos:", prodRes.data);
      setMovimientos(movRes.data);
      setProductos(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCategorias(catRes.data);
      setProveedores(provRes.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleAddOrUpdate = async (data) => {
    if (data.id) {
      await axios.put(`/api/inventario/${data.id}/`, data);
    } else {
      await axios.post("/api/inventario/", data);
    }
    setMovimientoEditando(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/inventario/${id}/`);
    fetchData();
  };

  return (
    <div style={styles.container}>

      <div style={styles.formContainer}>
        <InventarioForm
          onSubmit={handleAddOrUpdate}
          productos={productos}
          proveedorOptions={proveedores}
          movimientoActual={movimientoEditando}
        />
      </div>

      {movimientos.length === 0 ? (
        <div style={styles.noData}>No hay datos disponibles en la base de datos.</div>
      ) : (
        <div style={styles.listContainer}>
          <InventarioList
            movimientos={movimientos}
            productos={productos}
            categorias={categorias}
            onEdit={setMovimientoEditando}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#111827", // fondo general oscuro
      minHeight: "100vh",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#f8f9fc", // texto claro
    },
    formContainer: {
      width: "100%",
      maxWidth: "600px",
      backgroundColor: "#1e293b", // fondo del formulario
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      marginBottom: "30px",
      color: "#e5e7eb", // texto claro
    },
    listContainer: {
      width: "100%",
      maxWidth: "800px",
    },
    noData: {
      textAlign: "center",
      fontSize: "18px",
      color: "#9ca3af", // gris suave
      marginTop: "20px",
    },
    button: {
      backgroundColor: "#3b82f6", // azul principal
      color: "#ffffff",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "6px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#2563eb", // azul un poco más oscuro
    },
    card: {
      backgroundColor: "#1f2937", // fondo de cada ítem
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
      color: "#f8f9fc", // texto dentro de la tarjeta
    },
  };
  

export default InventarioPage;
