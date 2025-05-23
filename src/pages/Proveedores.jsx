import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProveedorForm from "../components/Proveedor/ProveedorForm";
import ProveedorList from "../components/Proveedor/ProveedorList";

const API_URL = "http://127.0.0.1:8000";
//const API_URL = "https://mercado-cafetero-backend-production.up.railway.app";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editarProveedor, setEditarProveedor] = useState(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/");
    obtenerProveedores(token);
    obtenerCategorias(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerProveedores = (token) => {
    axios
      .get(`${API_URL}/api/proveedores/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setProveedores(res.data))
      .catch(() => navigate("/"));
  };

  const obtenerCategorias = (token) => {
    axios
      .get(`${API_URL}/api/categorias/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error al obtener categorías:", err));
  };

  const agregarProveedor = (proveedor) => {
    const token = getToken();
    if (!token) return;

    const proveedorAEnviar = {
      ...proveedor,
      categoria: parseInt(proveedor.categoria),
    };

    axios
      .post(`${API_URL}/api/proveedores/`, proveedorAEnviar, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => obtenerProveedores(token))
      .catch((err) => console.error("Error al agregar:", err.response?.data || err));
  };

  const actualizarProveedor = (proveedor) => {
    const token = getToken();
    if (!token || !proveedor.id) return;

    axios
      .put(`${API_URL}/api/proveedores/${proveedor.id}/`, proveedor, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setEditarProveedor(null);
        obtenerProveedores(token);
      })
      .catch((err) => console.error("Error al actualizar:", err.response?.data || err));
  };

  const eliminarProveedor = (id) => {
    const token = getToken();
    if (!token) return;

    axios
      .delete(`${API_URL}/api/proveedores/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => obtenerProveedores(token))
      .catch((err) => console.error("Error al eliminar:", err));
  };

  return (
    <div style={styles.container}>
        <h1 style={styles.title}>Gestión de Proveedores</h1>
      <div style={styles.card}>
        <ProveedorForm
          categorias={categorias}
          proveedorActual={editarProveedor}
          onSubmit={editarProveedor ? actualizarProveedor : agregarProveedor}
          proveedores={proveedores} // <--- ESTA LÍNEA ARREGLA EL ERROR
        />
        <ProveedorList
          proveedores={proveedores}
          onEdit={setEditarProveedor}
          onDelete={eliminarProveedor}
        />
      </div>
    </div>
  );
}
  
  const styles = {
  pageContainer: {
      padding: "20px",
      minHeight: "100vh",
      width: "100%",               // ✅ Asegura que no exceda el ancho de la pantalla
      overflowX: "hidden",         // ✅ Previene scroll horizontal si algún componente se desborda
      boxSizing: "border-box",     // ✅ Incluye el padding en el ancho total
      backgroundColor: "#111827",  // fondo principal
      color: "#f8f9fc",            // texto muy claro
      display: "flex",             // opcional si quieres usar layout con sidebar
      flexDirection: "column",
},

    header: {
      width: "100%",
      backgroundColor: "#1f2937", // gris oscuro
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "12px", // más redondeado para dar el mismo estilo
      marginBottom: "24px", // margen más grande
      boxShadow: "0 6px 14px rgba(0, 0, 0, 0.5)", // igual al del inventario
    },
    container: {
      padding: "20px",
      minHeight: "100vh",
      backgroundColor: "#111827", // fondo principal
      color: "#f8f9fc", // texto muy claro
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "16px",
      backgroundColor: "#1f2937", // fondo del título
      padding: "12px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
    },
    card: {
      width: "90%",
      maxWidth: "850px",
      margin: "0 auto",
      backgroundColor: "#1e293b", // slate oscuro
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    },
    loading: {
      color: "#c2c9d6", // gris claro
      fontSize: "16px",
      fontStyle: "italic",
      marginTop: "16px",
    },
  };
  
export default Proveedores;
