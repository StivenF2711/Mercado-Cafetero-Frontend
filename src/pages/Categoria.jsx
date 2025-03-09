import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

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
    console.log("Token antes de la petición:", token);
    if (!token) {
      navigate("/login");
      return;
    }

    if (!API_URL) {
      console.error("API_URL no está definido. Revisa tu archivo .env.");
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
        <h1 style={styles.title}>☕ Mercado Cafetero - Categorías</h1>
      </header>

      <div style={styles.container}>
        {/* Formulario para agregar categoría */}
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

        {/* Mostrar loading mientras se cargan las categorías */}
        {loading ? (
          <p style={styles.loadingMessage}>Cargando categorías...</p>
        ) : categorias.length === 0 ? (
          <p style={styles.emptyMessage}>No hay categorías registradas.</p>
        ) : (
          <div style={styles.list}>
            {categorias.map((cat) => (
              <div key={cat.id} style={styles.card}>
                {editarCategoria && editarCategoria.id === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editarCategoria.nombre}
                      onChange={(e) =>
                        setEditarCategoria({ ...editarCategoria, nombre: e.target.value })
                      }
                      style={styles.input}
                    />
                    <button onClick={() => actualizarCategoria(cat.id)} style={styles.saveButton}>
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <h3 style={styles.name}>{cat.nombre}</h3>
                    <div style={styles.buttonGroup}>
                      <button onClick={() => setEditarCategoria(cat)} style={styles.editButton}>
                        Editar
                      </button>
                      <button onClick={() => eliminarCategoria(cat.id)} style={styles.deleteButton}>
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 **Estilos**
const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#F5E1C3",
    padding: "20px",
    width: "100vw",
  },
  header: {
    width: "100%",
    backgroundColor: "#D4A373",
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#5B3A29",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
  },
  container: {
    width: "90%",
    maxWidth: "800px",
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
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
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  addButton: {
    backgroundColor: "#28A745",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#FFA500",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#DC3545",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loadingMessage: {
    color: "#5B3A29",
    fontSize: "16px",
    fontStyle: "italic",
  },
  emptyMessage: {
    color: "#5B3A29",
    fontSize: "16px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#FFF8E1",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default Categorias;
