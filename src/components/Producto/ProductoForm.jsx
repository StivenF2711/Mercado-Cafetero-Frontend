import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://web-production-46688.up.railway.app"; // Cambia esto a tu URL de API real

const ProductoForm = ({ agregarProducto, productoSeleccionado, onProductoActualizado }) => {
    const [formulario, setFormulario] = useState({
        id: null,
        nombre: "",
        categoria: "",
        proveedor: "",
        imagen: null,
        unidad_medida: "",
    });

    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        // Cargar categorías al inicio
        axios.get(`${API_URL}/api/categorias/`, {
            headers: { Authorization: `Token ${token}` },
        }).then(res => {
            setCategorias(res.data);
        });

        // Cargar todos los proveedores al inicio
        axios.get(`${API_URL}/api/proveedores/`, {
            headers: { Authorization: `Token ${token}` },
        }).then(res => setProveedores(res.data));
    }, []);

    // Filtrar proveedores cada vez que cambia la categoría seleccionada
    useEffect(() => {
        const token = getToken();
        if (!token) return;

        if (formulario.categoria) {
            axios.get(`${API_URL}/api/proveedores/filtrar_por_categoria/`, {
                params: { categoria_id: formulario.categoria },
                headers: { Authorization: `Token ${token}` },
            })
            .then(res => {
                setProveedores(res.data);
                // Si el proveedor seleccionado ya no está en la lista filtrada, limpiar selección
                if (!res.data.find(p => p.id === Number(formulario.proveedor))) {
                    setFormulario(prev => ({ ...prev, proveedor: "" }));
                }
            })
            .catch(err => {
                console.error("Error al filtrar proveedores por categoría:", err);
            });
        } else {
            // Si no hay categoría seleccionada, cargar todos los proveedores
            axios.get(`${API_URL}/api/proveedores/`, {
                headers: { Authorization: `Token ${token}` },
            }).then(res => setProveedores(res.data));
        }
    }, [formulario.categoria]);

    useEffect(() => {
        if (productoSeleccionado) {
            setFormulario({ 
                ...productoSeleccionado, 
                imagen: null // No cargar la imagen para evitar problemas
            });
        } else {
            setFormulario({
                id: null,
                nombre: "",
                categoria: "",
                proveedor: "",
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

        if (!formulario.nombre || !formulario.categoria || !formulario.unidad_medida) {
            alert("Por favor complete todos los campos obligatorios (Nombre, Categoría, Unidad de Medida).");
            return;
        }

        const token = getToken();
        if (!token) return;

        const formData = new FormData();
        formData.append('nombre', formulario.nombre);
        formData.append('categoria', formulario.categoria);
        formData.append('unidad_medida', formulario.unidad_medida);

        if (formulario.proveedor && formulario.proveedor !== '') {
            formData.append('proveedor', formulario.proveedor);
        }

        if (formulario.imagen) {
            console.log("Imagen detectada en formulario:", formulario.imagen.name);
            formData.append('imagen', formulario.imagen);
        }

        if (formulario.id) {
            formData.append('id', formulario.id);
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
                'Content-Type': 'multipart/form-data',
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
                    imagen: null,
                    unidad_medida: "",
                });
            })
            .catch((err) => {
                console.error("Error al guardar/actualizar producto:", err);
                if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Headers:", err.response.headers);
                    console.error("Data:", err.response.data);

                    if (err.response.status === 500) {
                        alert("Error 500: Problema interno del servidor. Revisa la consola del backend de Django.");
                    } else {
                        alert(`Error ${err.response.status}: ${err.response.statusText}`);
                    }
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

            <select
                name="unidad_medida"
                value={formulario.unidad_medida}
                onChange={handleChange}
                style={styles.input}
                required
            >
                <option value="">Seleccione una unidad de medida</option>
                <option value="unidad">Unidad</option>
                <option value="kilogramo">Kilogramo (kg)</option>
                <option value="gramo">Gramo (g)</option>
                <option value="libra">Libra (lb)</option>
                <option value="onza">Onza (oz)</option>
                <option value="litro">Litro (L)</option>
                <option value="mililitro">Mililitro (ml)</option>
                <option value="galon">Galón</option>
                <option value="metro">Metro (m)</option>
                <option value="centimetro">Centímetro (cm)</option>
                <option value="pulgada">Pulgada (in)</option>
                <option value="pie">Pie (ft)</option>
                <option value="yarda">Yarda (yd)</option>
                <option value="metro_cuadrado">Metro cuadrado (m²)</option>
                <option value="pie_cuadrado">Pie cuadrado (ft²)</option>
                <option value="caja">Caja</option>
                <option value="paquete">Paquete</option>
                <option value="bolsa">Bolsa</option>
                <option value="docena">Docena</option>
                <option value="par">Par</option>
                <option value="rollo">Rollo</option>
                <option value="botella">Botella</option>
                <option value="lata">Lata</option>
                <option value="frasco">Frasco</option>
                <option value="sobre">Sobre</option>
                <option value="tubo">Tubo</option>
            </select>

            <input
                type="file"
                name="imagen"
                accept="image/*"
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