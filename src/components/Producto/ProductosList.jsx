import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Importa SweetAlert2

const API_URL = "http://127.0.0.1:8000";

const ProductoList = ({ onEdit, productos: productosProp }) => {
    const [productos, setProductos] = useState(productosProp);
    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        setProductos(productosProp); // Actualizar la lista cuando la prop cambia
    }, [productosProp]);

    const eliminarProducto = (id) => {
        const token = getToken();
        if (!token) return;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${API_URL}/api/productos/${id}/`, {
                        headers: { Authorization: `Token ${token}` },
                    })
                    .then(() => {
                        setProductos(productos.filter((p) => p.id !== id));
                        Swal.fire(
                            '¡Eliminado!',
                            'El producto ha sido eliminado.',
                            'success'
                        );
                    })
                    .catch((err) => {
                        console.error("Error al eliminar producto:", err);
                        Swal.fire(
                            '¡Error!',
                            'Hubo un problema al eliminar el producto.',
                            'error'
                        );
                    });
            }
        });
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Lista de Productos</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Proveedor</th>
                        <th>Precio Compra</th>
                        <th>Precio Venta</th>
                        <th>Unidad de Medida</th>
                        <th>Stock</th> {/* Nueva columna para el stock */}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td style={styles.td}>{producto.nombre}</td>
                            <td style={styles.td}>{producto.categoria_nombre || producto.categoria}</td>
                            <td style={styles.td}>{producto.proveedor_nombre || producto.proveedor}</td>
                            <td style={styles.td}>${producto.precio_compra}</td>
                            <td style={styles.td}>${producto.precio_venta}</td>
                            <td style={styles.td}>{producto.unidad_medida || "N/A"}</td>
                            <td style={styles.td}>{producto.stock}</td> {/* Mostrar el stock */}
                            <td style={styles.td}>
                                <button style={styles.editBtn} onClick={() => onEdit(producto)}>✏️</button>
                                <button style={styles.deleteBtn} onClick={() => eliminarProducto(producto.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        marginTop: "40px",
        padding: "20px",
        backgroundColor: "#1e293b",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        color: "#f8f9fc",
    },
    title: {
        fontSize: "20px",
        marginBottom: "16px",
        color: "#f8f9fc",
        textAlign: "center",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        textAlign: "left",
        padding: "10px",
        backgroundColor: "#334155",
        borderBottom: "1px solid #475569",
        fontWeight: "600",
        fontSize: "14px",
        color: "#f1f5f9",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #475569",
        fontSize: "14px",
    },
    editBtn: {
        marginRight: "8px",
        padding: "4px 8px",
        backgroundColor: "#3b82f6",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    deleteBtn: {
        padding: "4px 8px",
        backgroundColor: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
};

export default ProductoList;