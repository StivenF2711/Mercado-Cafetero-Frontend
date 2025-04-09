import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProveedorForm from "../components/Proveedor/ProveedorForm";
import ProveedorList from "../components/Proveedor/ProveedorList";

//const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://mercadocafetero.up.railway.app";

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

    console.log("Proveedor a enviar:", proveedorAEnviar);

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
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Proveedores</h1>
      </header>

      <div style={styles.container}>
        <ProveedorForm
          categorias={categorias}
          proveedorActual={editarProveedor}
          onSubmit={editarProveedor ? actualizarProveedor : agregarProveedor}
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
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#111827", // gris azulado oscuro
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#1f2937", // gris oscuro
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // sombra más profunda
  },
  title: {
    color: "#f9fafb", // blanco suave
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0,
  },
  container: {
    width: "90%",
    maxWidth: "800px",
    backgroundColor: "#1e293b", // slate oscuro (tailwind slate-800)
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
    color: "#e5e7eb", // texto claro
  },
};

export default Proveedores;
