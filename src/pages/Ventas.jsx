import React, { useState } from "react";
import RegistrarVenta from "../components/Ventas/RegistrarVenta";
import ListaVentas from "../components/Ventas/ListaVentas";

const VentasPage = () => {
  const [ventaReciente, setVentaReciente] = useState(null);

  return (
    <div>
      <RegistrarVenta onVentaCreada={setVentaReciente} />
      <ListaVentas key={ventaReciente ? ventaReciente.id : "init"} />
    </div>
  );
};

export default VentasPage;
