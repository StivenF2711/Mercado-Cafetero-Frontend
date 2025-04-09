import CategoriaCard from "./CategoriaCard";

function CategoriaList({ categorias, editarCategoria, setEditarCategoria, actualizarCategoria, eliminarCategoria }) {
  if (categorias.length === 0) {
    return <p style={{ color: "#5B3A29", fontSize: "16px" }}>No hay categorías registradas.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
      {categorias.map((cat) => (
        <CategoriaCard
          key={cat.id}
          cat={cat}
          editarCategoria={editarCategoria}
          setEditarCategoria={setEditarCategoria}
          actualizarCategoria={actualizarCategoria}
          eliminarCategoria={eliminarCategoria}
        />
      ))}
    </div>
  );
}

export default CategoriaList;
