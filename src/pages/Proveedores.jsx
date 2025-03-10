import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: "", categoria: "", dias_visita: [] });
  const [editarProveedor, setEditarProveedor] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://mercadocafetero.up.railway.app"; // 🔹 Definir la URL base

  useEffect(() => {
    obtenerProveedores();
    obtenerCategorias();
  }, []);

  const obtenerProveedores = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    axios
      .get(`${API_URL}/api/proveedores/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => setProveedores(response.data))
      .catch(() => navigate("/"));
  };

  const obtenerCategorias = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/categorias/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  };

  const agregarProveedor = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_URL}/api/proveedores/`,
        nuevoProveedor,
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => {
        setNuevoProveedor({ nombre: "", categoria: "", dias_visita: [] });
        obtenerProveedores();
      })
      .catch((error) => console.error("Error al agregar:", error));
  };

  const actualizarProveedor = (id) => {
    const token = localStorage.getItem("token");

    // 📌 Asegurar que los datos sean correctos antes de enviar
    const proveedorActualizado = {
        ...editarProveedor,
        telefono: editarProveedor.telefono.trim() === "" ? "000-000-0000" : editarProveedor.telefono,  // ✅ Teléfono por defecto
        dias_visita: Array.isArray(editarProveedor.dias_visita) 
            ? editarProveedor.dias_visita 
            : editarProveedor.dias_visita.replace(/[[\]']+/g, '').split(",").map(d => d.trim()), // ✅ Formato correcto
    };

    axios.put(
        `${API_URL}/api/proveedores/${id}/`,
        proveedorActualizado,
        { 
            headers: { 
                Authorization: `Token ${token}`,
                "Content-Type": "application/json"
            }
        }
    )
    .then(() => {
        setEditarProveedor(null);
        obtenerProveedores();
    })
    .catch((error) => console.error("Error al actualizar:", error));
};



  const eliminarProveedor = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${API_URL}/api/proveedores/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => obtenerProveedores())
      .catch((error) => console.error("Error al eliminar:", error));
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>☕ Mercado Cafetero - Proveedores</h1>
      </header>

      <div style={styles.container}>
        {/* 📝 Formulario para agregar proveedores */}
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Nombre del proveedor"
            value={nuevoProveedor.nombre}
            onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })}
            style={styles.input}
          />
          <select
            value={nuevoProveedor.categoria}
            onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, categoria: e.target.value })}
            style={styles.select}
          >
            <option value="">Seleccionar Categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Días de visita (Ej: Lunes, Miércoles)"
            value={nuevoProveedor.dias_visita.join(", ")}
            onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, dias_visita: e.target.value.split(", ") })}
            style={styles.input}
          />
          <button onClick={agregarProveedor} style={styles.addButton}>Agregar</button>
        </div>

        {proveedores.length === 0 ? (
          <p style={styles.emptyMessage}>No hay proveedores registrados.</p>
        ) : (
          <div style={styles.list}>
            {proveedores.map((prov) => (
              <div key={prov.id} style={styles.card}>
                {editarProveedor && editarProveedor.id === prov.id ? (
                  <>
                    <input
                      type="text"
                      value={editarProveedor.nombre}
                      onChange={(e) => setEditarProveedor({ ...editarProveedor, nombre: e.target.value })}
                      style={styles.input}
                    />
                    <select
                      value={editarProveedor.categoria}
                      onChange={(e) => setEditarProveedor({ ...editarProveedor, categoria: e.target.value })}
                      style={styles.select}
                    >
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editarProveedor.dias_visita.join(", ")}
                      onChange={(e) => setEditarProveedor({ ...editarProveedor, dias_visita: e.target.value.split(", ") })}
                      style={styles.input}
                    />
                    <button onClick={() => actualizarProveedor(prov.id)} style={styles.saveButton}>
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <h3 style={styles.name}>{prov.nombre}</h3>
                    <p style={styles.name}>
                      Categoría: {prov.categoria_nombre || "No especificada"}
                    </p>
                    <p style={styles.name}>Días de visita: {prov.dias_visita.join(", ") || "No especificados"}</p>
                    <div style={styles.buttonGroup}>
                      <button onClick={() => setEditarProveedor(prov)} style={styles.editButton}>
                        Editar
                      </button>
                      <button onClick={() => eliminarProveedor(prov.id)} style={styles.deleteButton}>
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
    display: "flex", 
    justifyContent: "center",
    alignItems: "center", 
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
  select: {
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
  name: {
    color: "black",
    fontWeight: "bold",
  },
  

};

export default Proveedores;
