import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const API_URL = "https://web-production-46688.up.railway.app"

const ProductoList = ({ onEdit, productos: productosProp }) => {
    const [productos, setProductos] = useState(productosProp);
    const [searchTerm, setSearchTerm] = useState('');
    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        setProductos(productosProp);
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Filtrar productos según searchTerm (ignore case)
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Lista de Productos</h2>

            <input
                type="text"
                placeholder="Buscar producto por nombre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Correo Proveedor</th>
                        <th style={styles.th}>Proveedor</th>
                        <th style={styles.th}>Unidad de Medida</th>
                        <th style={styles.th}>Imagen</th>
                        <th style={styles.th}>Fecha Creación</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                            <tr key={producto.id}>
                                <td style={styles.td}>{producto.nombre}</td>
                                <td style={styles.td}>{producto.proveedor_email || "Sin correo"}</td>
                                <td style={styles.td}>
                                    {producto.proveedor_nombre
                                        ? `${producto.proveedor_nombre} (${producto.proveedor_categoria_nombre})`
                                        : "Sin proveedor"}
                                </td>
                                <td style={styles.td}>{producto.unidad_medida || "N/A"}</td>
                                <td style={styles.td}>
                                    {producto.imagen_url ? (
                                        <img
                                            src={producto.imagen_url}
                                            alt={producto.nombre}
                                            style={styles.productImage}
                                        />
                                    ) : (
                                        <span style={styles.noImage}>Sin imagen</span>
                                    )}
                                </td>
                                <td style={styles.td}>{formatDate(producto.fecha_creacion)}</td>
                                <td style={styles.td}>
                                    <button style={styles.editBtn} onClick={() => onEdit(producto)}>✏️</button>
                                    <button style={styles.deleteBtn} onClick={() => eliminarProducto(producto.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" style={{ textAlign: "center" }}>No se encontraron productos</td></tr>
                    )}
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
    searchInput: {
        width: "100%",
        padding: "10px",
        marginBottom: "16px",
        borderRadius: "6px",
        border: "1px solid #475569",
        fontSize: "14px",
        backgroundColor: "#334155",
        color: "#f8f9fc",
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
    productImage: {
        width: "50px",
        height: "50px",
        objectFit: "cover",
        borderRadius: "6px",
        border: "1px solid #475569",
    },
    noImage: {
        color: "#94a3b8",
        fontStyle: "italic",
        fontSize: "12px",
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
