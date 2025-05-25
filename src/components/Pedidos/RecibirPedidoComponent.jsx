// src/components/Pedidos/RecibirPedidoComponent.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const RecibirPedidoComponent = ({ pedido, onVolver }) => {
  const [detalles, setDetalles] = useState([]);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    if (pedido && pedido.detalles) {
      // Inicializar los detalles con cantidades recibidas y productos dañados en 0 o valores previos
      const inicializados = pedido.detalles.map((detalle) => ({
        ...detalle,
        cantidad_recibida: detalle.cantidad_recibida || 0,
        productos_danados: detalle.productos_danados || 0,
      }));
      setDetalles(inicializados);
      setError(null);
      setExito(null);
    }
  }, [pedido]);

  if (!pedido) {
    return <p>No hay pedido seleccionado para recibir.</p>;
  }

  const handleCambio = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    let valNum = parseInt(valor);
    if (isNaN(valNum) || valNum < 0) valNum = 0;

    if (campo === "cantidad_recibida") {
      if (valNum > nuevosDetalles[index].cantidad_pedida) {
        valNum = nuevosDetalles[index].cantidad_pedida;
      }
      // Ajustar productos_danados si supera la nueva cantidad_recibida
      if (nuevosDetalles[index].productos_danados > valNum) {
        nuevosDetalles[index].productos_danados = valNum;
      }
    }

    if (campo === "productos_danados") {
      if (valNum > nuevosDetalles[index].cantidad_recibida) {
        valNum = nuevosDetalles[index].cantidad_recibida;
      }
    }

    nuevosDetalles[index][campo] = valNum;
    setDetalles(nuevosDetalles);
    setExito(null); // Limpiar mensaje de éxito si cambia algo
    setError(null); // Limpiar mensaje de error si cambia algo
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);
    setExito(null);

    try {
      const payload = {
        detalles: detalles.map(({ id, cantidad_recibida, productos_danados }) => ({
          id,
          cantidad_recibida,
          productos_danados,
        })),
        // No envíes estado si el backend lo maneja automáticamente
      };

      await axios.put(`https://web-production-46688.up.railway.app/api/pedidos/${pedido.id}/recibir/`, payload);

      setExito("Pedido recibido correctamente.");
      onVolver();
    } catch (err) {
      console.error(err);
      // Extraer mensaje del backend si existe
      const mensajeError =
        err.response?.data?.error ||
        err.message ||
        "Error al guardar la recepción del pedido.";
      setError(mensajeError);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recibir Pedido ID: {pedido.id}</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {exito && <p className="text-green-500 mb-2">{exito}</p>}

      <table className="min-w-full bg-white shadow rounded mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Cantidad Pedida</th>
            <th className="px-4 py-2">Cantidad Recibida</th>
            <th className="px-4 py-2">Productos Dañados</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle, idx) => (
            <tr key={detalle.id} className="border-b">
              <td className="px-4 py-2">{detalle.producto_nombre}</td>
              <td className="px-4 py-2">{detalle.cantidad_pedida}</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="0"
                  max={detalle.cantidad_pedida}
                  value={detalle.cantidad_recibida}
                  onChange={(e) => handleCambio(idx, "cantidad_recibida", e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="0"
                  max={detalle.cantidad_recibida}
                  value={detalle.productos_danados}
                  onChange={(e) => handleCambio(idx, "productos_danados", e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex space-x-4">
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar Recepción"}
        </button>
        <button
          onClick={onVolver}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar / Volver
        </button>
      </div>
    </div>
  );
};

export default RecibirPedidoComponent;
