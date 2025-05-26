import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [correo, setCorreo] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('empleado');
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null); // para saber si estamos editando

  // Cargar usuarios existentes
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://web-production-46688.up.railway.app/api/usuarios/');
      setUsuarios(response.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  const limpiarFormulario = () => {
    setCorreo('');
    setNombreCompleto('');
    setPassword('');
    setRol('empleado');
    setEditId(null);
    setError(null);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    setError(null);

    const nuevoUsuario = {
      correo,
      nombre_completo: nombreCompleto,
      password,
      rol,
    };

    try {
      if (editId) {
        // Editar usuario
        const response = await axios.put(
          `https://web-production-46688.up.railway.app/api/usuarios/${editId}/`,
          nuevoUsuario
        );
        setUsuarios(usuarios.map(u => (u.id === editId ? response.data : u)));
        alert('Usuario actualizado exitosamente');
      } else {
        // Crear usuario nuevo
        const response = await axios.post(
          'https://web-production-46688.up.railway.app/api/usuarios/',
          nuevoUsuario
        );
        setUsuarios([...usuarios, response.data]);
        alert('Usuario creado exitosamente');
      }
      limpiarFormulario();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Error desconocido al crear/actualizar usuario');
      }
    }
  };

  const editarUsuario = (usuario) => {
    setEditId(usuario.id);
    setCorreo(usuario.correo);
    setNombreCompleto(usuario.nombre_completo);
    setRol(usuario.rol);
    setPassword(''); // no mostramos contraseña
    setError(null);
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await axios.delete(`https://web-production-46688.up.railway.app/api/usuarios/${id}/`);
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert('Usuario eliminado exitosamente');
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  return (
    <div>
      <h2>{editId ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      <form onSubmit={crearUsuario}>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            disabled={!!editId} // no permitir cambiar correo si editando
          />
        </div>
        <div>
          <label>Nombre completo:</label>
          <input
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editId} // obligatorio solo si es nuevo usuario
            placeholder={editId ? 'Déjalo vacío para no cambiar' : ''}
          />
        </div>
        <div>
          <label>Rol:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="administrador">Administrador</option>
            <option value="jefe_bodega">Jefe de Bodega</option>
            <option value="empleado">Empleado</option>
          </select>
        </div>
        <button type="submit">{editId ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
        {editId && <button type="button" onClick={limpiarFormulario} style={{marginLeft: '10px'}}>Cancelar</button>}
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}

      <h2>Usuarios existentes</h2>
      <table border="1" cellPadding="5" style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Correo</th>
            <th>Nombre completo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.nombre_completo}</td>
              <td>{usuario.rol}</td>
              <td>
                <button onClick={() => editarUsuario(usuario)}>Editar</button>
                <button onClick={() => eliminarUsuario(usuario.id)} style={{ marginLeft: '10px' }}>Eliminar</button>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay usuarios</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
