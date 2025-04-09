import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CategoriaForm from "../components/Categoria/CategoriaForm";
import CategoriaList from "../components/Categoria/CategoriaList";

const API_URL = "https://mercado-cafetero-backend-production.up.railway.app";
//const API_URL = "http://127.0.0.1:8000";


function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "" });
  const [editarCategoria, setEditarCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/categorias/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarCategoria = async () => {
    const token = localStorage.getItem("token");
    if (!token || !API_URL) return;

    try {
      await axios.post(`${API_URL}/api/categorias/`, nuevaCategoria, {
        headers: { Authorization: `Token ${token}` },
      });
      setNuevaCategoria({ nombre: "" });
      obtenerCategorias();
    } catch (error) {
      console.error("Error al agregar categoría:", error);
    }
  };

  const actualizarCategoria = async (id) => {
    const token = localStorage.getItem("token");
    if (!token || !API_URL) return;

    try {
      await axios.put(`${API_URL}/api/categorias/${id}/`, editarCategoria, {
        headers: { Authorization: `Token ${token}` },
      });
      setEditarCategoria(null);
      obtenerCategorias();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const eliminarCategoria = async (id) => {
    const token = localStorage.getItem("token");
    if (!token || !API_URL) return;

    try {
      await axios.delete(`${API_URL}/api/categorias/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      obtenerCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Mercado Cafetero - Categorías</h1>
      </header>

      <div style={styles.container}>
        <CategoriaForm
          nuevaCategoria={nuevaCategoria}
          setNuevaCategoria={setNuevaCategoria}
          agregarCategoria={agregarCategoria}
        />

        {loading ? (
          <p style={styles.loadingMessage}>Cargando categorías...</p>
        ) : (
          <CategoriaList
            categorias={categorias}
            editarCategoria={editarCategoria}
            setEditarCategoria={setEditarCategoria}
            actualizarCategoria={actualizarCategoria}
            eliminarCategoria={eliminarCategoria}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#111827", // gris azulado oscuro (rgb(17, 24, 39))
    padding: "20px",
    width: "100vw",
  },
  header: {
    width: "100%",
    backgroundColor: "#1f2937", // gris oscuro
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)", // sombra más marcada
  },
  title: {
    color: "#f8f9fc", // gris muy claro (texto)
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
  },
  container: {
    width: "90%",
    maxWidth: "800px",
    textAlign: "center",
    backgroundColor: "#1e293b", // slate oscuro (como el form de login)
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    color: "#e5e7eb", // texto claro
  },
  loadingMessage: {
    color: "#c2c9d6", // --lt-color-gray-400 (tono más suave para texto)
    fontSize: "16px",
    fontStyle: "italic",
  },
};


export default Categorias;
