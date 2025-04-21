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
        <Link to="/inventario" style={styles.link}>Inventario</Link>
        <Link to="/producto" style={styles.link}>Productos</Link>
        <Link to="/transacciones" style={styles.link}>Entradas y Salidas</Link>
        <Link to="/Pedido" style={styles.link}>Hacer pedido</Link>
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
    width: "100vw",
    backgroundColor: "#111827", // fondo oscuro (tailwind gray-900)
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
  },
  title: {
    color: "#f9fafb", // casi blanco
    fontSize: "18px",
    fontWeight: "bold",
  },
  linksContainer: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  link: {
    color: "#93c5fd", // azul claro (tailwind blue-300)
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
    transition: "color 0.3s",
  },
  logoutButton: {
    backgroundColor: "#ef4444", // rojo (tailwind red-500)
    color: "#ffffff",
    padding: "6px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.3s",
  },
};

export default Navbar;
