import React, { useState } from "react";
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
    setError(null);

    const backendUrl ="https://mercado-cafetero-backend-production.up.railway.app"; // Asegúrate de que esta sea la URL correcta de tu backend
    if (!backendUrl) {
      setError("Error interno: No se ha configurado la URL del backend.");
      return;
    }

    try {
      console.log("Enviando solicitud a:", `${backendUrl}/api/login/`);

      const response = await axios.post(`${backendUrl}/api/login/`, { username, password });

      if (response.data.token && response.data.role) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        console.log("Token guardado:", response.data.token);
        console.log("Rol guardado:", response.data.role);

        const redirectTo = location.state?.from || "/proveedores";
        console.log("Redirigiendo a:", redirectTo);
        navigate(redirectTo);
      } else {
        setError("Respuesta inválida del servidor: Falta token o rol.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Usuario o contraseña incorrectos.");
        } else if (error.response.status === 405) {
          setError("Método no permitido. Verifica que la API acepta POST.");
        } else {
          setError(`Error en el servidor (${error.response.status}).`);
        }
      } else if (error.request) {
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
    backgroundColor: "rgb(17, 24, 39)", // fondo oscuro
  },
  loginBox: {
    backgroundColor: "rgb(30, 41, 59)", // formulario oscuro
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.16), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    color: "#f8f9fc", // texto claro (gris muy claro)
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#dee3ed", // gris claro
    marginBottom: "20px",
  },
  errorMessage: {
    color: "#D32F2F", // rojo error
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
    color: "#dee3ed", // gris claro
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    maxWidth: "350px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #c2c9d6",
    outline: "none",
    transition: "border 0.3s",
    backgroundColor: "#f8f9fc",
    color: "#2f3237",
  },
  button: {
    width: "100%",
    backgroundColor: "#5e636e",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  buttonHover: {
    backgroundColor: "#2f3237",
  },
};

export default Login;