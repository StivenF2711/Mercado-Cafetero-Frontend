import React, { useState } from "react";
import CrearPedido from "../components/Pedidos/CrearPedidoComponent";
import VerPedidos from "../components/Pedidos/VerPedidoComponent";
import RecibirPedidoComponent from "../components/Pedidos/RecibirPedidoComponent";

const Pedidos = () => {
  const [vista, setVista] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Función para seleccionar pedido y cambiar a vista de recibir
  const manejarRecibirPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setVista("recibir");
  };

  // Función para volver a la lista de pedidos desde recibir
  const volverLista = () => {
    setPedidoSeleccionado(null);
    setVista("ver");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Gestión de Pedidos</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setVista("crear")}
          className={`px-4 py-2 rounded ${
            vista === "crear" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Realizar Pedido
        </button>
        <button
          onClick={() => setVista("ver")}
          className={`px-4 py-2 rounded ${
            vista === "ver" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Ver Pedidos
        </button>
      </div>

      <div>
        {vista === "crear" && <CrearPedido />}
        {vista === "ver" && (
          <VerPedidos onRecibirPedido={manejarRecibirPedido} />
        )}
        {vista === "recibir" && pedidoSeleccionado && (
          <RecibirPedidoComponent pedido={pedidoSeleccionado} onVolver={volverLista} />
        )}
      </div>
    </div>
  );
};

export default Pedidos;
