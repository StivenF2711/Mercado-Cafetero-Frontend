import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/inventario/"; // Ajusta la URL de tu API

const InventarioDetalle = () => {
    const [inventarioDetalles, setInventarioDetalles] = useState([]);
    const [token] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            obtenerInventarioDetalles();
        }
    }, [token]);

    const obtenerInventarioDetalles = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Token ${token}` },
            });
            setInventarioDetalles(response.data);
        } catch (error) {
            console.error("Error al obtener el detalle del inventario:", error);
            // Manejar el error (mostrar mensaje al usuario, etc.)
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Detalle del Inventario</h2>
            {inventarioDetalles.length > 0 ? (
                <div style={styles.gridContainer}>
                    {inventarioDetalles.map((item) => (
                        <div key={item.producto_id} style={styles.itemCard}>
                            {item.producto_imagen && (
                                <img
                                    src={item.producto_imagen}
                                    alt={item.producto_nombre}
                                    style={styles.productImage}
                                />
                            )}
                            <h3 style={styles.productName}>{item.producto_nombre}</h3>
                            <p style={styles.stock}>Stock: {item.producto_stock} {item.producto_unidad_medida}</p>
                            <p style={styles.cantidadMovimiento}>
                                Último Movimiento: {item.cantidad_movimiento} ({item.tipo_movimiento})
                            </p>
                            <p style={styles.precioVenta}>Precio Venta: ${item.producto_precio_venta}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay detalles de inventario disponibles.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        backgroundColor: "#1e293b",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        color: "#f8f9fc",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        textAlign: "center",
        color: "#f8f9fc",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    itemCard: {
        backgroundColor: "#0f172a",
        padding: "15px",
        borderRadius: "8px",
        textAlign: "center",
    },
    productImage: {
        maxWidth: "100%",
        height: "auto",
        borderRadius: "4px",
        marginBottom: "10px",
    },
    productName: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "5px",
        color: "#f8f9fc",
    },
    stock: {
        fontSize: "16px",
        marginBottom: "5px",
        color: "#cbd5e1",
    },
    cantidadMovimiento: {
        fontSize: "16px",
        marginBottom: "5px",
        color: "#cbd5e1",
    },
    precioVenta: {
        fontSize: "16px",
        color: "#86efac",
    },
};

export default InventarioDetalle;