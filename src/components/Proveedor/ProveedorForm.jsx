import { useState, useEffect } from "react";

const ProveedorForm = ({ onSubmit, proveedorActual, categorias }) => {
  const [proveedor, setProveedor] = useState({
    nombre: "",
    categoria: "",
    telefono: "",
    email: "",
    dias_visita: "", // Siempre string
  });

  useEffect(() => {
    if (proveedorActual) {
      setProveedor({
        ...proveedorActual,
        dias_visita: typeof proveedorActual.dias_visita === "string"
          ? proveedorActual.dias_visita
          : "",
      });
    }
  }, [proveedorActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProveedor({ ...proveedor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Proveedor a enviar:", proveedor);
    onSubmit(proveedor);
  };

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const diasArray = proveedor.dias_visita
    ? proveedor.dias_visita.split(",").map(d => d.trim()).filter(Boolean)
    : [];

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del proveedor"
        value={proveedor.nombre}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <select
        name="categoria"
        value={proveedor.categoria}
        onChange={handleChange}
        style={styles.select}
        required
      >
        <option value="">Seleccionar Categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="telefono"
        placeholder="Teléfono del proveedor"
        value={proveedor.telefono}
        onChange={handleChange}
        style={styles.input}
      />

      <div style={styles.checkboxContainer}>
        {diasSemana.map((dia) => {
          const isChecked = diasArray.includes(dia);

          return (
            <label
              key={dia}
              style={{
                ...styles.checkboxLabel,
                backgroundColor: isChecked ? "rgb(255, 255, 255)" : "rgba(122, 122, 122, 0.82)",
                color: isChecked ? "#851010" : "#333",
              }}
            >
              <input
                type="checkbox"
                value={dia}
                checked={isChecked}
                onChange={(e) => {
                  const checked = e.target.checked;
                  let updatedDias = [...diasArray];

                  if (checked && !updatedDias.includes(dia)) {
                    updatedDias.push(dia);
                  } else if (!checked) {
                    updatedDias = updatedDias.filter((d) => d !== dia);
                  }

                  const nuevoValor = updatedDias.join(",");
                  setProveedor({ ...proveedor, dias_visita: nuevoValor });
                }}
                style={{ marginRight: "5px" }}
              />
              {dia}
            </label>
          );
        })}
      </div>

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico del proveedor"
        value={proveedor.email}
        onChange={handleChange}
        style={styles.input}
      />

      <button type="submit" style={styles.addButton}>
        {proveedorActual ? "Actualizar" : "Agregar"}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    margin: "0 auto 16px",
    padding: "12px",
    maxWidth: "400px",
    backgroundColor: "#1f2937",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
  },
  input: {
    padding: "6px",
    fontSize: "13px",
    borderRadius: "4px",
    border: "1px solid #4b5563",
    backgroundColor: "#374151",
    color: "#f3f4f6",
    width: "95%",
  },
  select: {
    padding: "6px",
    fontSize: "13px",
    borderRadius: "4px",
    border: "1px solid #4b5563",
    backgroundColor: "#374151",
    color: "#f3f4f6",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s",
  },
  checkboxContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "6px",
    marginBottom: "6px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 6px",
    borderRadius: "6px",
    backgroundColor: "#4b5563",
    color: "#f9fafb",
    fontSize: "12px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ProveedorForm;
