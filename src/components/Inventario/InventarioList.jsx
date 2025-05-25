import React, { useState, useEffect } from "react";
import axios from "axios";
import EditarProductoModal from "./EditarProductoModal";

const API_URL = "https://web-production-46688.up.railway.app";

const InventarioList = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState("stock");

  const getToken = () => localStorage.getItem("token");

  const cargarDatos = async () => {
    const token = getToken();
    if (!token) {
      setError("No se encontró el token de autenticación.");
      setCargando(false);
      return;
    }

    try {
      const [productosRes, inventarioRes] = await Promise.all([
        axios.get(`${API_URL}/api/productos/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get(`${API_URL}/api/inventario/`, {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);

      const productosData = productosRes.data;
      const inventarioData = inventarioRes.data;

      // Mapeo inventario para acceso rápido por id producto
      const inventarioMap = {};
      inventarioData.forEach((inv) => {
        inventarioMap[inv.producto] = inv;
      });

      // Mapear productos y asignar stock y precios usando obtener_precios_actuales
      const productosConDatos = productosData.map((prod) => {
        const inv = inventarioMap[prod.id] || {};
        return {
          ...prod,
          stock: inv.stock_actual ?? 0,
          precio_venta: inv.ultimo_precio_venta ?? "0.00",
          precio_compra: inv.ultimo_precio_compra ?? "0.00",
        };
      });

      setProductos(productosConDatos);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos.");
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAbrirModal = (producto, modo) => {
    setProductoSeleccionado(producto);
    setModoEdicion(modo);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
  };

  if (cargando) return <div>Cargando inventario...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inventario de Productos</h2>
      <div style={styles.productList}>
        {productos.map((producto) => {
          const imageUrl = producto.imagen?.startsWith("http")
            ? producto.imagen
            : `${API_URL}${producto.imagen}`;

          return (
            <div key={producto.id} style={styles.productCard}>
              {producto.imagen ? (
                <img
                  src={imageUrl}
                  alt={producto.nombre}
                  style={styles.productImage}
                />
              ) : (
                <div style={styles.noImage}>Sin imagen</div>
              )}
              <h3 style={styles.productName}>{producto.nombre}</h3>
              <p style={styles.productCategory}>
                Categoría: {producto.categoria_nombre}
              </p>
              <p style={styles.productStock}>
                Stock: {producto.stock} {producto.unidad_medida}
              </p>
              <p style={styles.productPrice}>
                Precio Compra: ${producto.precio_compra}
              </p>
              <p style={styles.productPrice}>
                Precio Venta: ${producto.precio_venta}
              </p>
              <button
                onClick={() => handleAbrirModal(producto, "stock")}
                style={styles.editButton}
              >
                Modificar stock
              </button>
              <button
                onClick={() => handleAbrirModal(producto, "precios")}
                style={styles.editButtonSecondary}
              >
                Editar precios
              </button>
            </div>
          );
        })}
      </div>

      {productos.length === 0 && !cargando && (
        <div style={{ color: "#f8f9fc", textAlign: "center", marginTop: 20 }}>
          No hay productos en el inventario.
        </div>
      )}

      {mostrarModal && productoSeleccionado && (
        <EditarProductoModal
          producto={productoSeleccionado}
          onClose={handleCerrarModal}
          onUpdate={cargarDatos}
          modo={modoEdicion}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#f8f9fc",
  },
  productList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "flex-start",
  },
  productCard: {
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    width: "calc(20% - 20px)",
    minWidth: "200px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    color: "#f8f9fc",
  },
  productImage: {
    width: "200",
    height: "120",
    borderRadius: "4px",
    marginBottom: "10px",
    objectFit: "cover",
    maxHeight: "150px",
  },
  noImage: {
    width: "100%",
    height: "150px",
    backgroundColor: "#334155",
    borderRadius: "4px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#f8f9fc",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#f8f9fc",
  },
  productCategory: {
    fontSize: "14px",
    color: "#a7b0be",
    marginBottom: "5px",
  },
  productStock: {
    fontSize: "16px",
    color: "#cbd5e1",
    marginBottom: "10px",
  },
  productPrice: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#818cf8",
    marginBottom: "10px",
  },
  editButton: {
    backgroundColor: "#3b82f6", // azul
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "8px",
    transition: "background-color 0.3s ease",
  },
  editButtonSecondary: {
    backgroundColor: "#f97316", // naranja
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
};

export default InventarioList;
