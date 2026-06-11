import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const PropiedadService = {
  // A correção está aqui: passamos o objeto de filtros diretamente ao Axios
  getAll: (filtros) => api.get('/propiedades', { params: filtros }),
  getById: (id) => api.get(`/propiedades/${id}`)
};