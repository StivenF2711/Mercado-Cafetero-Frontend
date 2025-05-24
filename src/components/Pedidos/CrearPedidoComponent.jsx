import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const CrearPedido = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [, setCategoriaProveedor] = useState('');
  const [loadingProductos, setLoadingProductos] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/proveedores/`)
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error al cargar proveedores', err));
  }, []);

  useEffect(() => {
    if (proveedorSeleccionado) {
      setLoadingProductos(true);

      axios.get(`${API_URL}/api/proveedores/${proveedorSeleccionado}/`)
        .then(res => {
          const categoria = res.data.categoria;
          setCategoriaProveedor(categoria);

          axios.get(`${API_URL}/api/productos/?proveedor=${proveedorSeleccionado}&categoria=${categoria}`)
            .then(res => setProductos(res.data))
            .catch(err => {
              console.error('Error al cargar productos filtrados', err);
              setProductos([]);
            })
            .finally(() => setLoadingProductos(false));
        })
        .catch(err => {
          console.error('Error al cargar proveedor', err);
          setCategoriaProveedor('');
          setProductos([]);
          setLoadingProductos(false);
        });
    } else {
      setCategoriaProveedor('');
      setProductos([]);
    }
  }, [proveedorSeleccionado]);

  const agregarProducto = () => {
    const prod = productos.find(p => p.id === parseInt(productoSeleccionado));
    if (!prod) return;

    if (detallesPedido.some(p => p.producto === prod.id)) {
      alert('Este producto ya fue agregado.');
      return;
    }

    if (cantidad < 1) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    setDetallesPedido([
      ...detallesPedido,
      {
        producto: prod.id,
        producto_nombre: prod.nombre,
        cantidad_pedida: parseInt(cantidad)
      }
    ]);

    setProductoSeleccionado('');
    setCantidad(1);
  };

  const eliminarProducto = (index) => {
    const nuevos = [...detallesPedido];
    nuevos.splice(index, 1);
    setDetallesPedido(nuevos);
  };

  const crearPedido = () => {
    if (!proveedorSeleccionado || detallesPedido.length === 0) {
      alert("Debe seleccionar un proveedor y al menos un producto.");
      return;
    }

    axios.post(`${API_URL}/api/pedidos/`, {
      proveedor: proveedorSeleccionado,
      estado: 'pendiente',
      detalles: detallesPedido.map(p => ({
        producto: p.producto,
        cantidad_pedida: p.cantidad_pedida
      }))
    }).then(() => {
      alert('Pedido creado con éxito');
      setProveedorSeleccionado('');
      setDetallesPedido([]);
    }).catch(err => {
      console.error(err);
      alert('Error al crear pedido');
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Crear nuevo pedido</h2>

      <select
        value={proveedorSeleccionado}
        onChange={e => setProveedorSeleccionado(e.target.value)}
        className="w-full mb-4 border p-2 rounded"
      >
        <option value="">Seleccione un proveedor</option>
        {proveedores.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      {proveedorSeleccionado && (
        <>
          <p className="mb-2 text-gray-600">
            Proveedor: {proveedores.find(p => p.id === parseInt(proveedorSeleccionado))?.nombre}
          </p>

          <div className="mb-4">
            {loadingProductos ? (
              <p className="text-gray-500">Cargando productos...</p>
            ) : (
              <>
                <select
                  value={productoSeleccionado}
                  onChange={e => setProductoSeleccionado(e.target.value)}
                  className="w-full mb-2 border p-2 rounded"
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                  className="w-full mb-2 border p-2 rounded"
                  min={1}
                />

                <button
                  onClick={agregarProducto}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Agregar producto
                </button>
              </>
            )}
          </div>
        </>
      )}

      <ul className="mb-4">
        {detallesPedido.map((p, i) => (
          <li key={i} className="flex justify-between items-center mb-1">
            <span>{p.producto_nombre} - {p.cantidad_pedida} unidades</span>
            <button
              onClick={() => eliminarProducto(i)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {detallesPedido.length > 0 && (
        <button
          onClick={crearPedido}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear pedido
        </button>
      )}
    </div>
  );
};

export default CrearPedido;
