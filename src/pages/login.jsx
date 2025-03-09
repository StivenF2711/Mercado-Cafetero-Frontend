import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar error previo

    // Verificar si la URL del backend está definida correctamente
    const backendUrl = "https://mercadocafetero.up.railway.app";
    if (!backendUrl) {
      setError("Error interno: No se ha configurado la URL del backend.");
      return;
    }

    try {
      console.log("Enviando solicitud a:", `${backendUrl}/api/login/`);
      
      const response = await axios.post(`${backendUrl}/api/login/`, { username, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token guardado:", response.data.token);

        const redirectTo = location.state?.from || "/proveedores";
        console.log("Redirigiendo a:", redirectTo);
        navigate(redirectTo);
      } else {
        setError("Respuesta inválida del servidor.");
      }
    } catch (error) {
      if (error.response) {
        // Si el backend responde con un código de error
        if (error.response.status === 401) {
          setError("Usuario o contraseña incorrectos.");
        } else if (error.response.status === 405) {
          setError("Método no permitido. Verifica que la API acepta POST.");
        } else {
          setError(`Error en el servidor (${error.response.status}).`);
        }
      } else if (error.request) {
        // Si no hay respuesta del servidor
        setError("No se pudo conectar con el servidor.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
      console.error("Error en login:", error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>☕ Mercado Cafetero</h2>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <div>
            <label style={styles.label}>Usuario</label>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

// 🎨 **Estilos**
const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#F5E1C3",
  },
  loginBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    color: "#5B3A29",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#7D5A50",
    marginBottom: "20px",
  },
  errorMessage: {
    color: "#DC3545",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    display: "block",
    color: "#5B3A29",
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    maxWidth: "350px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border 0.3s",
  },
  button: {
    width: "100%",
    backgroundColor: "#D4A373",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  buttonHover: {
    backgroundColor: "#C08A54",
  },
};

export default Login;
