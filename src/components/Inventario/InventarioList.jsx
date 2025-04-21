import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: 'var(--lt-color-background-default)',
    borderRadius: '1rem',
    boxShadow: 'var(--lt-shadow-medium)',
    color: 'var(--lt-color-text-default)',
  },
  loading: {
    fontSize: '18px',
    color: '#007BFF',
    fontWeight: 'bold',
  },
  noData: {
    fontSize: '18px',
    color: '#888',
    textAlign: 'center',
    marginTop: '20px',
  },
  item: {
    backgroundColor: 'var(--lt-color-background-light)',
    padding: '0.75rem 1rem',
    border: '1px solid var(--lt-color-gray-300)',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: '16px',
    color: 'var(--lt-color-text-default)',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  filtroSelect: {
    padding: '0.5rem 1rem',
    border: '1px solid var(--lt-color-gray-300)',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--lt-color-background-light)',
    color: 'var(--lt-color-text-default)',
  },
  filtroInput: {
    padding: '0.5rem 1rem',
    border: '1px solid var(--lt-color-gray-300)',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--lt-color-background-light)',
    color: 'var(--lt-color-text-default)',
  },
  tablaInventario: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'var(--lt-color-background-light)',
  },
  tablaThTd: {
    padding: '0.75rem 1rem',
    border: '1px solid var(--lt-color-gray-300)',
    textAlign: 'left',
  },
  tablaTh: {
    backgroundColor: 'var(--lt-color-gray-200)',
    color: 'var(--lt-color-text-secondary)',
  },
  tablaTd: {
    color: 'var(--lt-color-text-default)',
  },
};

const InventarioList = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/inventario'); // URL de tu API
        const data = await response.json();
        setMovimientos(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar los movimientos:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  if (movimientos.length === 0) {
    return <div style={styles.noData}>No hay datos disponibles en la base de datos.</div>;
  }

  return (
    <div style={styles.container}>
      {/* Filtros de inventario */}
      <div className="filtros-inventario" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select className="filtro-select" style={styles.filtroSelect}>
          <option>Filtrar por Producto</option>
          {/* Aquí puedes agregar opciones dinámicas */}
        </select>
        <input type="text" className="filtro-input" style={styles.filtroInput} placeholder="Buscar..." />
      </div>

      {/* Tabla de inventario */}
      <table className="tabla-inventario" style={styles.tablaInventario}>
        <thead>
          <tr>
            <th style={styles.tablaTh}>Producto</th>
            <th style={styles.tablaTh}>Cantidad</th>
            <th style={styles.tablaTh}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id}>
              <td style={styles.tablaTd}>{movimiento.producto.nombre}</td>
              <td style={styles.tablaTd}>{movimiento.cantidad}</td>
              <td style={styles.tablaTd}>
                <div className="acciones-btn" style={styles.actions}>
                  <button>Editar</button>
                  <button>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioList;
