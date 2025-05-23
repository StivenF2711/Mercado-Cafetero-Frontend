import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CategoriaForm from "../components/Categoria/CategoriaForm";
import CategoriaList from "../components/Categoria/CategoriaList";

//  const API_URL = "https://mercado-cafetero-backend-production.up.railway.app";
const API_URL = "http://127.0.0.1:8000";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "" });
  const [editarCategoria, setEditarCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerCategorias();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div style={styles.container}>
      <h2 style={styles.title}>Gestión de Categorías</h2>

      <div style={styles.card}>
        <CategoriaForm
          nuevaCategoria={nuevaCategoria}
          setNuevaCategoria={setNuevaCategoria}
          agregarCategoria={agregarCategoria}
        />

        {loading ? (
          <p style={styles.loading}>Cargando categorías...</p>
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
  width: "100%",                // ✅ Usa todo el ancho disponible del contenedor
  maxWidth: "500px",            // ✅ Reduce el ancho máximo para hacerlo más compacto
  margin: "0 auto",             // Centra la tarjeta horizontalmente
  backgroundColor: "#1e293b",   // Color de fondo
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  loading: {
    color: "#c2c9d6", // gris claro
    fontSize: "16px",
    fontStyle: "italic",
    marginTop: "16px",
  },
};

export default Categorias;
