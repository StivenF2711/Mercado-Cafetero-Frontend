<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gestión de Pedidos - Mercado Cafetero</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css">
</head>
<body class="bg-gray-900 text-white p-6">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Pedidos por Verificar</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Pedido #12345</h2>
        <p class="text-sm text-gray-300">Proveedor: Café Colombia S.A.S</p>
        <p class="text-sm text-gray-300">Fecha: 2025-04-20</p>
        <div class="mt-4 flex justify-between items-center">
          <button onclick="window.location.href='verificar_pedido.html'"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Verificar pedido
          </button>
          <button onclick="marcarPedidoVerificado()"
            class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
            Completar
          </button>
        </div>
      </div>
      <!-- Puedes duplicar esta tarjeta para más pedidos -->
    </div>
  </div>

  <script>
    function marcarPedidoVerificado() {
      alert("Pedido marcado como verificado.");
      // Aquí podrías hacer redirección o cambio de estado real con JS/React
    }
  </script>
</body>
</html>
