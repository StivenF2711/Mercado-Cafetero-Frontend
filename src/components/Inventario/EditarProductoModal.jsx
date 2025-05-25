import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://web-production-46688.up.railway.app";

const EditarProductoModal = ({ producto, onClose, onUpdate, modo }) => {
  const [cantidad, setCantidad] = useState(0);
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [precioCompra, setPrecioCompra] = useState(producto.precio_compra || 0);
  const [precioVenta, setPrecioVenta] = useState(producto.precio_venta || 0);
  const [guardando, setGuardando] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const handleGuardar = async () => {
    if (modo === "precios" && precioVenta < precioCompra) {
      toast.error("El precio de venta no puede ser menor que el precio de compra");
      return;
    }

    if (modo === "stock" && cantidad <= 0) {
      toast.error("La cantidad debe ser mayor que cero");
      return;
    }

    setGuardando(true);
    const token = getToken();

    try {
      if (modo === "stock") {
        await axios.post(
          `${API_URL}/api/inventario/`,
          {
            producto: producto.id,
            tipo: tipoMovimiento,
            cantidad: parseInt(cantidad),
            observaciones: "Actualización manual desde frontend",
          },
          { headers: { Authorization: `Token ${token}` } }
        );

        toast.success("Movimiento registrado en el inventario");
      } else if (modo === "precios") {
        await axios.post(
          `${API_URL}/api/inventario/`,
          {
            producto: producto.id,
            tipo: "ajuste",
            cantidad: 0,
            precio_compra: parseFloat(precioCompra),
            precio_venta: parseFloat(precioVenta),
            observaciones: "Actualización de precios desde frontend",
          },
          { headers: { Authorization: `Token ${token}` } }
        );

        toast.success("Precios actualizados correctamente");
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los cambios");
    }

    setGuardando(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>
          {modo === "stock" ? "Modificar stock" : "Editar precios"}: {producto.nombre}
        </h3>

        {modo === "stock" && (
          <>
            <label style={styles.label}>
              Tipo de movimiento:
              <select
                value={tipoMovimiento}
                onChange={(e) => setTipoMovimiento(e.target.value)}
                style={styles.input}
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="vencimiento">Vencimiento</option>
                <option value="daño">Daño</option>
                <option value="pérdida">Pérdida</option>
              </select>
            </label>

            <label style={styles.label}>
              Cantidad:
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                style={styles.input}
              />
            </label>
          </>
        )}

        {modo === "precios" && (
          <>
            <label style={styles.label}>
              Precio de compra:
              <input
                type="number"
                min="0"
                step="0.01"
                value={precioCompra}
                onChange={(e) => setPrecioCompra(parseFloat(e.target.value) || 0)}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Precio de venta:
              <input
                type="number"
                min="0"
                step="0.01"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(parseFloat(e.target.value) || 0)}
                style={styles.input}
              />
            </label>
          </>
        )}

        <div style={styles.buttons}>
          <button onClick={handleGuardar} disabled={guardando} style={styles.saveButton}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancelar
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "8px",
    width: "320px",
    boxShadow: "0 0 10px rgba(0,0,0,0.7)",
    color: "#f8f9fc",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "15px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#f8f9fc",
    textAlign: "center",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#a7b0be",
  },
  input: {
    marginTop: "6px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f8f9fc",
    fontSize: "14px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  cancelButton: {
    backgroundColor: "#334155",
    color: "#a7b0be",
    border: "none",
    borderRadius: "4px",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
};

export default EditarProductoModal;
