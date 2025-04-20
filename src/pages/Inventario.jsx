import InventarioPage from "../components/Inventario/InventarioPage";

const Inventario = () => {
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestión de Inventario</h2>
      <InventarioPage />
    </div>
  );
};

export default Inventario;
