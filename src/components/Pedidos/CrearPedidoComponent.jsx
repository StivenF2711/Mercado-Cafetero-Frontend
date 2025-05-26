import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://web-production-46688.up.railway.app";

const styles = {
  container: {
    backgroundColor: "rgb(30, 41, 59)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 6px -1px rgba(0, 0, 0, 0.16), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
    maxWidth: "400px",
    margin: "auto",
    color: "#dee3ed",
  },
  title: {
    color: "#f8f9fc",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  select: {
    width: "100%",
    marginBottom: "16px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #c2c9d6",
    outline: "none",
    backgroundColor: "#f8f9fc",
    color: "#2f3237",
  },
  inputNumber: {
    width: "100%",
    marginBottom: "16px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #c2c9d6",
    outline: "none",
    backgroundColor: "#f8f9fc",
    color: "#2f3237",
  },
  buttonPrimary: {
    backgroundColor: "#5e636e",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
    marginRight: "8px",
  },
  buttonPrimaryHover: {
    backgroundColor: "#2f3237",
  },
  buttonAddProduct: {
    backgroundColor: "#3b82f6", // azul más brillante para agregar producto
    color: "white",
    padding: "10px 16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  buttonDelete: {
    color: "#D32F2F",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontWeight: "bold",
  },
  productItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    color: "#dee3ed",
  },
  loadingText: {
    color: "#9ca3af",
    marginBottom: "16px",
  },
  proveedorName: {
    marginBottom: "16px",
    color: "#9ca3af",
  },
  buttonSuccess: {
    backgroundColor: "#22c55e",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonCancel: {
    backgroundColor: "#dc2626",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

const CrearPedido = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [, setCategoriaProveedor] = useState("");
  const [loadingProductos, setLoadingProductos] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/proveedores/`)
      .then((res) => setProveedores(res.data))
      .catch((err) => console.error("Error al cargar proveedores", err));
  }, []);

  useEffect(() => {
    if (proveedorSeleccionado) {
      setLoadingProductos(true);

      axios
        .get(`${API_URL}/api/proveedores/${proveedorSeleccionado}/`)
        .then((res) => {
          const categoria = res.data.categoria;
          setCategoriaProveedor(categoria);

          axios
            .get(
              `${API_URL}/api/productos/?proveedor=${proveedorSeleccionado}&categoria=${categoria}`
            )
            .then((res) => setProductos(res.data))
            .catch((err) => {
              console.error("Error al cargar productos filtrados", err);
              setProductos([]);
            })
            .finally(() => setLoadingProductos(false));
        })
        .catch((err) => {
          console.error("Error al cargar proveedor", err);
          setCategoriaProveedor("");
          setProductos([]);
          setLoadingProductos(false);
        });
    } else {
      setCategoriaProveedor("");
      setProductos([]);
    }
  }, [proveedorSeleccionado]);

  const agregarProducto = () => {
    const prod = productos.find((p) => p.id === parseInt(productoSeleccionado));
    if (!prod) return;

    if (detallesPedido.some((p) => p.producto === prod.id)) {
      alert("Este producto ya fue agregado.");
      return;
    }

    if (cantidad < 1) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    setDetallesPedido([
      ...detallesPedido,
      {
        producto: prod.id,
        producto_nombre: prod.nombre,
        cantidad_pedida: parseInt(cantidad),
      },
    ]);

    setProductoSeleccionado("");
    setCantidad(1);
  };

  const eliminarProducto = (index) => {
    const nuevos = [...detallesPedido];
    nuevos.splice(index, 1);
    setDetallesPedido(nuevos);
  };

  const crearPedido = () => {
    if (!proveedorSeleccionado || detallesPedido.length === 0) {
      alert("Debe seleccionar un proveedor y al menos un producto.");
      return;
    }

    axios
      .post(`${API_URL}/api/pedidos/`, {
        proveedor: proveedorSeleccionado,
        estado: "pendiente",
        detalles: detallesPedido.map((p) => ({
          producto: p.producto,
          cantidad_pedida: p.cantidad_pedida,
        })),
      })
      .then(() => {
        alert("Pedido creado con éxito");
        cancelarPedido(); // Limpia al crear con éxito
      })
      .catch((err) => {
        console.error(err);
        alert("Error al crear pedido");
      });
  };

  // Función para cancelar el pedido (limpiar todo)
  const cancelarPedido = () => {
    setProveedorSeleccionado("");
    setProductoSeleccionado("");
    setCantidad(1);
    setDetallesPedido([]);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Crear nuevo pedido</h2>

      <select
        value={proveedorSeleccionado}
        onChange={(e) => {
          if (detallesPedido.length > 0) {
            alert(
              "No puede cambiar de proveedor mientras haya productos agregados al pedido. Primero cancele o elimine los productos."
            );
            return; // evita cambiar proveedor
          }
          setProveedorSeleccionado(e.target.value);
        }}
        style={styles.select}
      >
        <option value="">Seleccione un proveedor</option>
        {proveedores.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      {proveedorSeleccionado && (
        <>
          <p style={styles.proveedorName}>
            Proveedor:{" "}
            {
              proveedores.find((p) => p.id === parseInt(proveedorSeleccionado))
                ?.nombre
            }
          </p>

          <div style={{ marginBottom: "16px" }}>
            {loadingProductos ? (
              <p style={styles.loadingText}>Cargando productos...</p>
            ) : (
              <>
                <select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  style={styles.inputNumber}
                  min={1}
                />

                <button onClick={agregarProducto} style={styles.buttonAddProduct}>
                  Agregar producto
                </button>
              </>
            )}
          </div>
        </>
      )}

      <ul style={{ marginBottom: "16px", paddingLeft: 0 }}>
        {detallesPedido.map((p, i) => (
          <li key={i} style={styles.productItem}>
            <span>
              {p.producto_nombre} - {p.cantidad_pedida} unidades
            </span>
            <button
              onClick={() => eliminarProducto(i)}
              style={styles.buttonDelete}
              aria-label="Eliminar producto"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: "8px" }}>
        {detallesPedido.length > 0 && (
          <button onClick={crearPedido} style={styles.buttonSuccess}>
            Crear pedido
          </button>
        )}

        {(proveedorSeleccionado || detallesPedido.length > 0) && (
          <button onClick={cancelarPedido} style={styles.buttonCancel}>
            Cancelar pedido
          </button>
        )}
      </div>
    </div>
  );
};

export default CrearPedido;
