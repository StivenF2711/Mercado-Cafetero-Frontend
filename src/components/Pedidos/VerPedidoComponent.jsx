import React, { useEffect, useState } from "react";
import axios from "axios";

const VerPedidosComponent = ({ onRecibirPedido }) => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      const response = await axios.get("https://web-production-46688.up.railway.app/api/pedidos/");
      setPedidos(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      setError("No se pudieron cargar los pedidos.");
      setCargando(false);
    }
  };

  const abrirModal = (pedido) => {
    setPedidoSeleccionado(pedido);
    setNuevoEstado(pedido.estado || "pendiente"); // asegurarse que sea minúscula igual que opciones
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPedidoSeleccionado(null);
  };

  const actualizarEstado = async (estadoNuevo) => {
    if (typeof estadoNuevo !== "string") {
      console.error("¡Estado no válido!", estadoNuevo);
      return;
    }

    try {
      console.log("Enviando estado:", estadoNuevo);

      await axios.patch(
        `https://web-production-46688.up.railway.app/api/pedidos/${pedidoSeleccionado.id}/`,
        { estado: estadoNuevo }
      );

      console.log("Estado actualizado con éxito");

      // Actualizar localmente la lista para reflejar el cambio sin recargar
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          p.id === pedidoSeleccionado.id ? { ...p, estado: estadoNuevo } : p
        )
      );

      setNuevoEstado(estadoNuevo);
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      if (error.response) {
        console.log("Detalles:", error.response.data);
      }
    }
  };

  if (cargando) return <p className="text-center">Cargando pedidos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Listado de Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Proveedor</th>
              <th className="px-4 py-2 text-left">Productos</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-b">
                <td className="px-4 py-2">{pedido.id}</td>
                <td className="px-4 py-2">{pedido.proveedor || "N/A"}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-5">
                    {pedido.detalles.map((p, idx) => (
                      <li key={idx}>
                        {p.producto_nombre} ({p.cantidad_pedida})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  {new Date(pedido.fecha_pedido).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{pedido.estado || "pendiente"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => onRecibirPedido(pedido)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={
                      pedido.estado === "recibido" ||
                      pedido.estado === "cancelado" ||
                      pedido.estado === "incompleto"
                    }
                  >
                    Recibir
                  </button>

                  <button
                    onClick={() => abrirModal(pedido)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={
                      pedido.estado === "recibido" ||
                      pedido.estado === "cancelado" ||
                      pedido.estado === "incompleto"
                    }
                  >
                    Cambiar Estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para cambiar estado */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Cambiar estado del pedido #{pedidoSeleccionado.id}
            </h3>
            <label className="block mb-2">Nuevo estado:</label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="mb-4 w-full border px-2 py-1 rounded"
            >
              <option value="pendiente">Pendiente</option>
              <option value="cancelado">Cancelado</option>
              <option value="en proceso">En Proceso</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cerrarModal}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => actualizarEstado(nuevoEstado)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerPedidosComponent;
