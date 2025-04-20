import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const ProductoForm = ({ agregarProducto, productoSeleccionado, onProductoActualizado }) => {
    const [formulario, setFormulario] = useState({
        id: null,
        nombre: "",
        categoria: "",
        proveedor: "",
        precio_compra: "",
        precio_venta: "",
        imagen: null, // Para almacenar el archivo de la imagen
        unidad_medida: "",
    });

    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        axios.get(`${API_URL}/api/categorias/`, {
            headers: { Authorization: `Token ${token}` },
        }).then(res => setCategorias(res.data));

        axios.get(`${API_URL}/api/proveedores/`, {
            headers: { Authorization: `Token ${token}` },
        }).then(res => setProveedores(res.data));
    }, []);

    useEffect(() => {
        if (productoSeleccionado) {
            setFormulario({ ...productoSeleccionado, imagen: null }); // No precargar la imagen para evitar problemas
        } else {
            setFormulario({
                id: null,
                nombre: "",
                categoria: "",
                proveedor: "",
                precio_compra: "",
                precio_venta: "",
                imagen: null,
                unidad_medida: "",
            });
        }
    }, [productoSeleccionado]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormulario((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formulario.nombre || !formulario.precio_compra || !formulario.precio_venta || !formulario.unidad_medida || !formulario.categoria) {
            alert("Por favor complete todos los campos obligatorios (Nombre, Categoría, Precios, Unidad de Medida).");
            return;
        }

        const token = getToken();
        if (!token) return;

        const formData = new FormData();
        formData.append('nombre', formulario.nombre);
        formData.append('categoria', formulario.categoria);
        formData.append('proveedor', formulario.proveedor || ''); // Permite proveedor vacío si no es requerido
        formData.append('precio_compra', formulario.precio_compra);
        formData.append('precio_venta', formulario.precio_venta);
        formData.append('unidad_medida', formulario.unidad_medida);
        if (formulario.imagen) {
            formData.append('imagen', formulario.imagen);
        }
        if (formulario.id) {
            formData.append('id', formulario.id); // Incluye el ID para la actualización
        }

        const method = productoSeleccionado ? "put" : "post";
        const url = productoSeleccionado
            ? `${API_URL}/api/productos/${productoSeleccionado.id}/`
            : `${API_URL}/api/productos/`;

        axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data', // Importante para enviar archivos
                Authorization: `Token ${token}`,
            },
        })
            .then((res) => {
                if (productoSeleccionado) {
                    onProductoActualizado(res.data);
                } else {
                    agregarProducto(res.data);
                }
                setFormulario({
                    id: null,
                    nombre: "",
                    categoria: "",
                    proveedor: "",
                    precio_compra: "",
                    precio_venta: "",
                    imagen: null,
                    unidad_medida: "",
                });
            })
            .catch((err) => {
                console.error("Error al guardar/actualizar producto:", err);
                if (err.response) {
                    console.error("Respuesta del backend:", err.response);
                    alert("Hubo un error al procesar la solicitud.");
                } else if (err.request) {
                    console.error("Solicitud no completada:", err.request);
                    alert("No se pudo completar la solicitud.");
                } else {
                    console.error("Error:", err.message);
                    alert("Hubo un error inesperado.");
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} style={styles.card}>
            <h2 style={styles.title}>
                {productoSeleccionado ? "Editar Producto" : "Agregar Producto"}
            </h2>

            <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formulario.nombre}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <select
                name="categoria"
                value={formulario.categoria}
                onChange={handleChange}
                style={styles.input}
                required
            >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                    </option>
                ))}
            </select>

            <select
                name="proveedor"
                value={formulario.proveedor}
                onChange={handleChange}
                style={styles.input}
            >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                        {prov.nombre}
                    </option>
                ))}
            </select>

            <input
                type="number"
                name="precio_compra"
                placeholder="Precio de Compra"
                value={formulario.precio_compra}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <input
                type="number"
                name="precio_venta"
                placeholder="Precio de Venta"
                value={formulario.precio_venta}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <input
                type="text"
                name="unidad_medida"
                placeholder="Unidad de Medida"
                value={formulario.unidad_medida}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <input
                type="file"
                name="imagen"
                accept="image/*" // Acepta solo archivos de imagen
                onChange={handleChange}
                style={styles.input}
            />

            <button type="submit" style={styles.submitBtn}>
                {productoSeleccionado ? "Actualizar" : "Agregar"}
            </button>
        </form>
    );
};

const styles = {
    card: {
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        color: "#f8f9fc",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    title: {
        fontSize: "20px",
        marginBottom: "12px",
        textAlign: "center",
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #334155",
        backgroundColor: "#0f172a",
        color: "#f8f9fc",
    },
    submitBtn: {
        padding: "10px",
        backgroundColor: "#3b82f6",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        cursor: "pointer",
    },
};

export default ProductoForm;