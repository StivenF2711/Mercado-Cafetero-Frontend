import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL_PROVEEDORES = "https://mercado-cafetero-backend-production.up.railway.app/api/proveedores/"; // Ajusta la URL de tu API de proveedores
const API_URL_PRODUCTOS = "https://mercado-cafetero-backend-production.up.railway.app/api/productos/"; // Ajusta la URL de tu API de productos

const ContactarProveedorView = () => {
    const { id } = useParams(); // Obtiene el ID del proveedor de la URL
    const [proveedor, setProveedor] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productosProveedor, setProductosProveedor] = useState([]); // Productos asociados al proveedor
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProveedor();
        fetchProductos();
        fetchProductosProveedor(); // Opcional: si quieres mostrar los productos ya asociados
    }, [id]);

    const fetchProveedor = async () => {
        try {
            const response = await axios.get(`${API_URL_PROVEEDORES}${id}/`);
            setProveedor(response.data);
        } catch (error) {
            setError('Error al cargar la información del proveedor.');
            console.error('Error fetching proveedor:', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get(API_URL_PRODUCTOS);
            setProductos(response.data);
        } catch (error) {
            setError('Error al cargar la lista de productos.');
            console.error('Error fetching productos:', error);
        }
    };

    const fetchProductosProveedor = async () => {
        // Opcional: si tu backend tiene un endpoint para obtener los productos de un proveedor específico
        try {
            const response = await axios.get(`${API_URL_PROVEEDORES}${id}/productos/`);
            setProductosProveedor(response.data);
        } catch (error) {
            console.error('Error fetching productos del proveedor:', error);
            // No mostramos un error al usuario si falla, ya que es opcional
        }
    };

    const handleAgregarProducto = async () => {
        if (!productoSeleccionado) {
            setError('Por favor, selecciona un producto.');
            return;
        }
        setError('');
        setMessage('');
        try {
            // Asume que tu backend tiene un endpoint para agregar un producto a un proveedor
            await axios.post(`${API_URL_PROVEEDORES}${id}/agregar_producto/`, { producto_id: productoSeleccionado });
            setMessage(`Producto agregado al proveedor exitosamente.`);
            setProductoSeleccionado('');
            fetchProductosProveedor(); // Recargar la lista de productos del proveedor (opcional)
        } catch (error) {
            setError('Error al agregar el producto al proveedor.');
            console.error('Error adding producto al proveedor:', error);
        }
    };

    const styles = {
        pageContainer: {
            padding: "20px",
            minHeight: "100vh",
            backgroundColor: "#111827",
            color: "#f8f9fc",
        },
        container: {
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        },
        title: {
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#f8f9fc",
            textAlign: "center",
        },
        error: {
            color: "#ef4444",
            marginBottom: "10px",
            textAlign: "center",
        },
        message: {
            color: "#22c55e",
            marginBottom: "10px",
            textAlign: "center",
        },
        proveedorInfo: {
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#1f2937",
            borderRadius: "8px",
        },
        label: {
            display: "block",
            marginBottom: "5px",
            color: "#f8f9fc",
            fontWeight: "bold",
        },
        select: {
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #6b7280",
            backgroundColor: "#374151",
            color: "#f8f9fc",
            marginBottom: "15px",
        },
        button: {
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#3b82f6",
            color: "#f8f9fc",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background 0.3s",
        },
        listaProductos: {
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#1f2937",
            borderRadius: "8px",
        },
        listItem: {
            color: "#f8f9fc",
            marginBottom: "5px",
        },
    };

    if (!proveedor) {
        return <div style={styles.pageContainer}><p style={{ color: '#f8f9fc' }}>Cargando información del proveedor...</p></div>;
    }

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                <h2 style={styles.title}>Contactar Proveedor</h2>

                {error && <p style={styles.error}>{error}</p>}
                {message && <p style={styles.message}>{message}</p>}

                <div style={styles.proveedorInfo}>
                    <p><strong style={styles.label}>Nombre:</strong> {proveedor.nombre}</p>
                    <p><strong style={styles.label}>Correo Electrónico:</strong> {proveedor.email}</p>
                    {proveedor.telefono && <p><strong style={styles.label}>Teléfono:</strong> {proveedor.telefono}</p>}
                    {/* Agrega aquí más información del proveedor si es necesario */}
                </div>

                <div>
                    <label style={styles.label}>Seleccionar Producto a Asociar:</label>
                    <select
                        style={styles.select}
                        value={productoSeleccionado}
                        onChange={(e) => setProductoSeleccionado(e.target.value)}
                    >
                        <option value="">Seleccionar Producto</option>
                        {productos.map(producto => (
                            <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                        ))}
                    </select>
                    <button style={styles.button} onClick={handleAgregarProducto}>Agregar Producto</button>
                </div>

                {productosProveedor.length > 0 && (
                    <div style={styles.listaProductos}>
                        <h3 style={styles.label}>Productos Asociados a este Proveedor:</h3>
                        <ul>
                            {productosProveedor.map(producto => (
                                <li key={producto.id} style={styles.listItem}>{producto.nombre}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactarProveedorView;