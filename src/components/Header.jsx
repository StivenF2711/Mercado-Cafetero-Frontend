import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <span style={styles.coffeeIcon}>☕</span>
        <h1 style={styles.title}>Mercado Cafetero</h1>
      </div>

      <nav style={styles.nav}>
        <a href="/proveedores" style={styles.navLink}>
          Proveedores
        </a>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </nav>
    </header>
  );
}

// 📌 Estilos del Header
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#2C2C2C",
    color: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  coffeeIcon: {
    fontSize: "30px",
    marginRight: "10px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  navLink: {
    color: "#FFD700",
    fontSize: "16px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#D9534F",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Header;
