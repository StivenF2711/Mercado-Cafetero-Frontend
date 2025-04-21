import React from 'react';
import InventarioList from '../components/Inventario/InventarioList';  // Ajusta la ruta si es necesario

const Inventario = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Página de Inventario</h1>
            <div style={styles.inventarioListContainer}>
                <InventarioList />
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0f172a', // Un azul oscuro de fondo
        minHeight: '100vh', // Para que el fondo ocupe toda la pantalla vertical
        padding: '20px',
        color: '#f8f9fc', // Texto en color claro
    },
    title: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#f8f9fc',
    },
    inventarioListContainer: {
        backgroundColor: '#1e293b', // Un fondo más claro para el contenedor de la lista
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    },
};

export default Inventario;