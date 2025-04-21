import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Reemplaza con tu URL de backend

const ModalEnviarPedidoProveedor = ({ proveedor, onCerrar }) => {
    const [cuerpoCorreo, setCuerpoCorreo] = useState('');
    const [asuntoCorreo, setAsuntoCorreo] = useState(`Consulta para ${proveedor?.nombre || ''}`);
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);
    const getToken = () => localStorage.getItem('token');

    const handleEnviarCorreo = async () => {
        setEnviando(true);
        setErrorEnvio(null);
        const token = getToken();

        try {
            const response = await axios.post(
                `${API_URL}/api/enviar_correo_proveedor/`, // Nuevo endpoint en Django
                {
                    destinatario: proveedor.email,
                    asunto: asuntoCorreo,
                    cuerpo: cuerpoCorreo,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                }
            );
            console.log('Correo enviado:', response.data);
            alert('Correo enviado exitosamente.');
            onCerrar();
        } catch (error) {
            console.error('Error al enviar el correo:', error.response?.data || error.message);
            setErrorEnvio('Hubo un error al enviar el correo. Inténtalo de nuevo.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Enviar Correo a {proveedor?.nombre || 'Proveedor'}</h2>
            <label style={styles.label}>Asunto:</label>
            <input
                type="text"
                value={asuntoCorreo}
                onChange={(e) => setAsuntoCorreo(e.target.value)}
                style={styles.input}
            />
            <label style={styles.label}>Mensaje:</label>
            <textarea
                value={cuerpoCorreo}
                onChange={(e) => setCuerpoCorreo(e.target.value)}
                style={styles.textarea}
            />
            {errorEnvio && <p style={styles.error}>{errorEnvio}</p>}
            <div style={styles.buttons}>
                <button onClick={handleEnviarCorreo} style={styles.enviarButton} disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar Correo'}
                </button>
                <button onClick={onCerrar} style={styles.cancelarButton} disabled={enviando}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

const styles = {
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1e293b',
        padding: '20px',
        borderRadius: '8px',
        zIndex: 1000,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
        color: '#f8f9fc',
        width: '80%',
        maxWidth: '500px',
    },
    modalTitle: {
        fontSize: '20px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    textarea: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        borderRadius: '4px',
        backgroundColor: '#334155',
        color: '#f8f9fc',
        borderColor: '#475569',
        minHeight: '150px',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    enviarButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 15px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    cancelarButton: {
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 15px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default ModalEnviarPedidoProveedor;