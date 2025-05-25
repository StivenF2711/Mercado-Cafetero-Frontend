import React from "react";

export default function PagoFallido() {
  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold text-red-600">Pago fallido</h1>
      <p className="mt-2 text-gray-700">Tu pago fue rechazado o no se pudo procesar. Intenta nuevamente más tarde.</p>
    </div>
  );
}
