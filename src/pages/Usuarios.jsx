import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://web-production-46688.up.railway.app";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editarUsuario, setEditarUsuario] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre_completo: "",
    correo: "",
    password: "",
    rol: "",
  });
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return navigate("/");
    }
    obtenerUsuarios(token);
  }, [navigate]);

  const obtenerUsuarios = (token) => {
    axios
      .get(`${API_URL}/api/usuarios/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setUsuarios(res.data))
      .catch(() => {
        navigate("/");
      });
  };

  const actualizarUsuario = (usuario) => {
    const token = getToken();
    axios
      .put(`${API_URL}/api/usuarios/${usuario.id}/`, usuario, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        obtenerUsuarios(token);
        setEditarUsuario(null);
      })
      .catch((err) =>
        console.error("Error al actualizar:", err.response?.data || err)
      );
  };

  const eliminarUsuario = (id) => {
    const token = getToken();
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    axios
      .delete(`${API_URL}/api/usuarios/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => obtenerUsuarios(token))
      .catch((err) =>
        console.error("Error al eliminar:", err.response?.data || err)
      );
  };

  const crearUsuario = () => {
    const token = getToken();
    const { nombre_completo, correo, password, rol } = nuevoUsuario;
    if (!nombre_completo || !correo || !password || !rol) {
      alert("Todos los campos son obligatorios");
      return;
    }
    axios
      .post(`${API_URL}/api/usuarios/`, nuevoUsuario, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        obtenerUsuarios(token);
        setNuevoUsuario({
          nombre_completo: "",
          correo: "",
          password: "",
          rol: "",
        });
      })
      .catch((err) =>
        console.error("Error al crear usuario:", err.response?.data || err)
      );
  };

  const handleChange = (e, campo) => {
    setEditarUsuario({ ...editarUsuario, [campo]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Usuarios</h1>

      <h2 style={styles.subtitle}>Crear nuevo usuario</h2>
      <div style={styles.usuarioCard}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nuevoUsuario.nombre_completo}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, nombre_completo: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Correo"
          value={nuevoUsuario.correo}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevoUsuario.password}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
          }
          style={styles.input}
        />
        <select
          value={nuevoUsuario.rol}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
          }
          style={styles.input}
        >
          <option value="">Selecciona un rol</option>
          <option value="administrador">Administrador</option>
          <option value="jefe_bodega">Jefe de Bodega</option>
          <option value="empleado">Empleado</option>
        </select>
        <button onClick={crearUsuario} style={styles.btnCrear}>
          Crear Usuario
        </button>
      </div>

      <div style={styles.card}>
        {usuarios.map((usuario) => (
          <div key={usuario.id} style={styles.usuarioCard}>
            {editarUsuario?.id === usuario.id ? (
              <>
                <input
                  type="text"
                  value={editarUsuario.nombre_completo}
                  onChange={(e) => handleChange(e, "nombre_completo")}
                  style={styles.input}
                />
                <input
                  type="email"
                  value={editarUsuario.correo}
                  onChange={(e) => handleChange(e, "correo")}
                  style={styles.input}
                  disabled
                />
                <select
                  value={editarUsuario.rol}
                  onChange={(e) => handleChange(e, "rol")}
                  style={styles.input}
                >
                  <option value="administrador">Administrador</option>
                  <option value="jefe_bodega">Jefe de Bodega</option>
                  <option value="empleado">Empleado</option>
                </select>
                <button
                  onClick={() => actualizarUsuario(editarUsuario)}
                  style={styles.btnGuardar}
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditarUsuario(null)}
                  style={styles.btnCancelar}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Nombre:</strong> {usuario.nombre_completo}
                </p>
                <p>
                  <strong>Correo:</strong> {usuario.correo}
                </p>
                <p>
                  <strong>Rol:</strong> {usuario.rol}
                </p>
                <button
                  onClick={() => setEditarUsuario(usuario)}
                  style={styles.btnEditar}
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarUsuario(usuario.id)}
                  style={styles.btnEliminar}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "8px",
    marginTop: "20px",
  },
  card: {
    width: "90%",
    maxWidth: "850px",
    margin: "0 auto",
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  usuarioCard: {
    backgroundColor: "#334155",
    marginBottom: "16px",
    padding: "16px",
    borderRadius: "8px",
  },
  input: {
    padding: "8px",
    margin: "4px 0",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  btnEditar: {
    marginTop: "8px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnEliminar: {
    marginTop: "8px",
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "8px",
  },
  btnGuardar: {
    backgroundColor: "#10b981",
    color: "#fff",
    padding: "8px 16px",
    marginRight: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnCancelar: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnCrear: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default Usuarios;
