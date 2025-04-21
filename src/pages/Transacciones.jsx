import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://mercado-cafetero-backend-production.up.railway.app/api/inventario/"; // Ajusta la URL de tu API de inventario

const GestionStockView = () => {
    const [productos, setProductos] = useState([]);
    const [creandoEntradaId, setCreandoEntradaId] = useState(null);
    const [creandoSalidaId, setCreandoSalidaId] = useState(null);
    const [entradaCantidad, setEntradaCantidad] = useState('');
    const [salidaCantidad, setSalidaCantidad] = useState('');
    const [entradaObservaciones, setEntradaObservaciones] = useState('');
    const [salidaObservaciones, setSalidaObservaciones] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('https://mercado-cafetero-backend-production.up.railway.app/api/productos/'); // Ajusta la URL de tu API de productos
            setProductos(response.data);
        } catch (error) {
            setError('Error al cargar los productos.');
            console.error('Error fetching productos:', error);
        }
    };

    const handleCrearEntrada = (id) => {
        setCreandoEntradaId(id);
        setEntradaCantidad('');
        setEntradaObservaciones('');
        setCreandoSalidaId(null); // Asegurarse de que el formulario de salida esté cerrado
    };

    const handleCrearSalida = (id) => {
        setCreandoSalidaId(id);
        setSalidaCantidad('');
        setSalidaObservaciones('');
        setCreandoEntradaId(null); // Asegurarse de que el formulario de entrada esté cerrado
    };

    const handleInputChange = (event, type) => {
        const { value } = event.target;
        if (type === 'entrada') {
            setEntradaCantidad(value);
        } else if (type === 'salida') {
            setSalidaCantidad(value);
        } else if (type === 'entradaObservaciones') {
            setEntradaObservaciones(value);
        } else if (type === 'salidaObservaciones') {
            setSalidaObservaciones(value);
        }
    };

    const handleSubmitMovimiento = async (id, tipo, cantidad, observaciones) => {
        setMessage('');
        setError('');
        try {
            // Registrar el movimiento (entrada o salida)
            await axios.post(`${API_URL}`, {
                producto: id,
                tipo: tipo,
                cantidad: parseInt(cantidad, 10),
                observaciones: observaciones,
            });

            // Actualizar la lista de productos
            fetchProductos();

            // Si es una salida, verifica el stock del producto
            if (tipo === 'salida') {
                const producto = productos.find((p) => p.id === id);
                const nuevoStock = producto.stock - parseInt(cantidad, 10);

                // Si el stock es menor a 5, mostrar alerta
                if (nuevoStock < 5) {
                    setMessage(`Alerta: El stock del producto "${producto.nombre}" es menor a 5 unidades.`);
                }
            }

            setMessage(`Movimiento de ${tipo} registrado exitosamente para el producto con ID ${id}.`);
            setCreandoEntradaId(null);
            setCreandoSalidaId(null);
            setEntradaCantidad('');
            setSalidaCantidad('');
            setEntradaObservaciones('');
            setSalidaObservaciones('');

        } catch (error) {
            setError(`Error al registrar el movimiento de ${tipo} para el producto con ID ${id}.`);
            console.error('Error creating movimiento:', error);
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
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
        },
        thead: {
            backgroundColor: '#374151',
            color: '#f8f9fc',
        },
        th: {
            padding: '12px',
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        tbody: {},
        tr: {
            borderBottom: '1px solid #4b5563',
        },
        td: {
            padding: '10px',
            fontSize: '14px',
        },
        input: {
            width: '80px',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #6b7280',
            backgroundColor: '#374151',
            color: '#f8f9fc',
            fontSize: '14px',
            marginRight: '5px',
        },
        button: {
            padding: '6px 10px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background 0.3s',
            marginRight: '5px',
        },
        entradaButton: {
            backgroundColor: '#16a34a', // verde
            color: '#f8f9fc',
        },
        salidaButton: {
            backgroundColor: '#dc2626', // rojo
            color: '#f8f9fc',
        },
        formContainer: {
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#263238', // Un tono más oscuro para el formulario
            borderRadius: '4px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
        },
        label: {
            color: '#f8f9fc',
            fontSize: '14px',
        },
        textarea: {
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #6b7280',
            backgroundColor: '#374151',
            color: '#f8f9fc',
            fontSize: '14px',
        },
        submitButton: {
            backgroundColor: '#3b82f6', // azul para enviar
            color: '#f8f9fc',
        },
        cancelButton: {
            backgroundColor: '#4b5563', // gris para cancelar
            color: '#f8f9fc',
        },
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                <h2 style={styles.title}>Gestión de Stock (Entradas/Salidas)</h2>

                {error && <p style={styles.error}>{error}</p>}
                {message && <p style={styles.message}>{message}</p>}

                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            <th style={styles.th}>Nombre</th>
                            <th style={styles.th}>Stock Actual</th>
                            <th style={styles.th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                        {productos.map(producto => (
                            <tr key={producto.id} style={styles.tr}>
                                <td style={styles.td}>{producto.nombre}</td>
                                <td style={styles.td}>{producto.stock}</td>
                                <td style={styles.td}>
                                    <button style={{ ...styles.button, ...styles.entradaButton }} onClick={() => handleCrearEntrada(producto.id)}>Entrada</button>
                                    <button style={{ ...styles.button, ...styles.salidaButton }} onClick={() => handleCrearSalida(producto.id)}>Salida</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {productos.map(producto => (
                    <React.Fragment key={`form-${producto.id}`}>
                        {creandoEntradaId === producto.id && (
                            <div style={styles.formContainer}>
                                <label style={styles.label}>Cantidad Entrada:</label>
                                <input type="number" style={styles.input} value={entradaCantidad} onChange={(e) => handleInputChange(e, 'entrada')} />
                                <label style={styles.label}>Observaciones (opcional):</label>
                                <textarea style={styles.textarea} value={entradaObservaciones} onChange={(e) => handleInputChange(e, 'entradaObservaciones')} />
                                <button style={{ ...styles.button, ...styles.submitButton }} onClick={() => handleSubmitMovimiento(producto.id, 'entrada', entradaCantidad, entradaObservaciones)}>Registrar Entrada</button>
                                <button style={{ ...styles.button, ...styles.cancelButton }} onClick={() => setCreandoEntradaId(null)}>Cancelar</button>
                            </div>
                        )}

                        {creandoSalidaId === producto.id && (
                            <div style={styles.formContainer}>
                                <label style={styles.label}>Cantidad Salida:</label>
                                <input type="number" style={styles.input} value={salidaCantidad} onChange={(e) => handleInputChange(e, 'salida')} />
                                <label style={styles.label}>Observaciones (opcional):</label>
                                <textarea style={styles.textarea} value={salidaObservaciones} onChange={(e) => handleInputChange(e, 'salidaObservaciones')} />
                                <button style={{ ...styles.button, ...styles.submitButton }} onClick={() => handleSubmitMovimiento(producto.id, 'salida', salidaCantidad, salidaObservaciones)}>Registrar Salida</button>
                                <button style={{ ...styles.button, ...styles.cancelButton }} onClick={() => setCreandoSalidaId(null)}>Cancelar</button>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default GestionStockView;
