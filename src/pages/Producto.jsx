import { useState, useEffect } from "react";
import ProductoForm from "../components/Producto/ProductoForm";
import ProductoList from "../components/Producto/ProductosList";
import axios from "axios";

const API_URL = "https://web-production-46688.up.railway.app";
//const API_URL = "https://mercado-cafetero-backend-production.up.railway.app";

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [token] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (!token) {
            // Manejar la ausencia de token (redirigir, mostrar mensaje, etc.)
            return;
        }
        obtenerProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const obtenerProductos = () => {
        axios
            .get(`${API_URL}/api/productos/`, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((res) => setProductos(res.data))
            .catch((err) => console.error("Error al obtener productos:", err));
    };

    const agregarProducto = (nuevoProducto) => {
        setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
    };

    const iniciarEdicion = (producto) => {
        setProductoAEditar(producto);
    };

    const actualizarProducto = (productoActualizado) => {
        setProductos((prevProductos) =>
            prevProductos.map((p) => (p.id === productoActualizado.id ? productoActualizado : p))
        );
        setProductoAEditar(null); // Limpiar el producto seleccionado para editar
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                <ProductoForm
                    agregarProducto={agregarProducto}
                    productoSeleccionado={productoAEditar}
                    onProductoActualizado={actualizarProducto}
                />
                <ProductoList
                    productos={productos}
                    onEdit={iniciarEdicion}
                />
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "#f8f9fc",
    },
    container: {
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
};

export default Producto;