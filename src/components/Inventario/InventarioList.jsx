import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = "https://mercado-cafetero-backend-production.up.railway.app/"

const InventarioList = () => {
  const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const getToken = () => localStorage.getItem('token');
    useEffect(() => {
      const token = getToken();
      if (!token) {
          setError('No se encontró el token de autenticación.');
          setCargando(false);
          return;
      }
      axios.get(`${API_URL}/api/productos/`, {
        headers: { Authorization: `Token ${token}` },
    })
        .then(response => {
            setProductos(response.data);
            setCargando(false);
        })
        .catch(error => {
            console.error('Error al cargar el inventario:', error);
            setError('Error al cargar el inventario.');
            setCargando(false);
        });
}, []);
if (cargando) {
  return <div>Cargando inventario...</div>;
}
if (error) {
  return <div>Error: {error}</div>;
}
return (
  <div style={styles.container}>
      <h2 style={styles.title}>Inventario de Productos</h2>
      <div style={styles.productList}>
          {productos.map(producto => (
              <div key={producto.id} style={styles.productCard}>
                  {producto.imagen ? (
                      <img
                          src={`${API_URL}${producto.imagen}`}
                          alt={producto.nombre}
                          style={styles.productImage}
                      />
                  ) : (
                      <div style={styles.noImage}>Sin imagen</div>
                  )}
                  <h3 style={styles.productName}>{producto.nombre}</h3>
                  <p style={styles.productCategory}>Categoría: {producto.categoria_nombre}</p>
                  <p style={styles.productStock}>Stock: {producto.stock} {producto.unidad_medida}</p>
                  <p style={styles.productPrice}>Precio: ${producto.precio_venta}</p>
                  
              </div>
          ))}
      </div>
      {productos.length === 0 && !cargando && <div>No hay productos en el inventario.</div>}
  </div>
);
};
const styles = {
  container: {
      padding: '20px',
      backgroundColor: '#0f172a', // Azul oscuro de fondo
      borderRadius: '8px',
  },
  title: {
      fontSize: '24px',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#f8f9fc', // Texto claro
  },
  productList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'flex-start',
  },
  productCard: {
      backgroundColor: '#1e293b', // Azul más claro para las tarjetas
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      width: 'calc(20% - 20px)', // Ajusta el ancho según la cantidad de tarjetas por fila que desees
      minWidth: '200px',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      color: '#f8f9fc', // Texto claro en las tarjetas
  },
  productImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '4px',
      marginBottom: '10px',
      objectFit: 'cover',
      maxHeight: '150px',
  },
  noImage: {
      width: '100%',
      height: '150px',
      backgroundColor: '#334155', // Un tono de azul más oscuro para el "Sin imagen"
      borderRadius: '4px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#f8f9fc',
  },
  productName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#f8f9fc',
  },
  productCategory: {
      fontSize: '14px',
      color: '#a7b0be', // Un tono de gris azulado para la categoría
      marginBottom: '5px',
  },
  productStock: {
      fontSize: '16px',
      color: '#cbd5e1', // Otro tono de gris azulado para el stock
      marginBottom: '10px',
  },
  productPrice: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#818cf8', // Un azul más brillante para el precio
      marginBottom: '10px',
  },
  addToCartButton: {
      backgroundColor: '#3b82f6', // Un azul más llamativo para el botón
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
      '&:hover': {
          backgroundColor: '#2563eb',
      },
  },
};
export default InventarioList;