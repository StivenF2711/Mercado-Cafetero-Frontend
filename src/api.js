import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/'; // Ajusta la URL si es diferente

export const getProveedores = async () => {
    const response = await axios.get(`${API_URL}proveedores/`);
    return response.data;
};
