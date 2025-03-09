import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>☕ Mercado Cafetero</h1>
      <div style={styles.linksContainer}>
        <Link to="/proveedores" style={styles.link}>Proveedores</Link>
        <Link to="/categorias" style={styles.link}>Categorias</Link>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

// 🎨 **Estilos**
const styles = {
  navbar: {
    width: "100%",
    backgroundColor: "#5B3A29",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
  linksContainer: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "#FFD700",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.3s",
  },
  logoutButton: {
    backgroundColor: "#DC3545",
    color: "white",
    padding: "8px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
};

export default Navbar;
