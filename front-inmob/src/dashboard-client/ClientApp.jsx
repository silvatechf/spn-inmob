import React, { useEffect, useState, useCallback } from 'react';
import { PropiedadService } from '../services/api';

export default function ClientApp() {
  const [propiedades, setPropiedades] = useState([]);
  const [meta, setMeta] = useState({ total_registros: 0, pagina_actual: 1, total_paginas: 1 });
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [operacion, setOperacion] = useState('Todos');
  const [precioMax, setPrecioMax] = useState('Cualquier');
  const [barrio, setBarrio] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPropiedades = useCallback(async () => {
    setLoading(true);
    
    // Criamos um objeto apenas com parâmetros válidos
    const params = { page: currentPage };
    if (titulo.trim()) params.search = titulo;
    if (operacion !== 'Todos') params.operacion = operacion;
    if (precioMax !== 'Cualquier') params.precio_max = precioMax;
    if (barrio !== 'Todos') params.barrio = barrio;

    try {
      const response = await PropiedadService.getAll(params);
      setPropiedades(response.data?.data || []);
      setMeta(response.data?.meta || { total_registros: 0, pagina_actual: 1, total_paginas: 1 });
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setPropiedades([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, operacion, precioMax, titulo, barrio]);

  // AQUI ESTAVA A FALHA: O useEffect garante que a busca ocorra ao mudar filtros
  useEffect(() => {
    fetchPropiedades();
  }, [fetchPropiedades]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Nuestras Propiedades</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 rounded-xl">
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="p-3 border rounded" 
          value={titulo} 
          onChange={(e) => {setTitulo(e.target.value); setCurrentPage(1);}} 
        />
        
        <select className="p-3 border rounded" value={operacion} onChange={(e) => {setOperacion(e.target.value); setCurrentPage(1);}}>
          <option value="Todos">Todos os regimes</option>
          <option value="Venta">Venta</option>
          <option value="Alquiler">Alquiler</option>
        </select>

        <select className="p-3 border rounded" value={precioMax} onChange={(e) => {setPrecioMax(e.target.value); setCurrentPage(1);}}>
          <option value="Cualquier">Cualquier rango</option>
          <option value="500">Hasta 500 €</option>
          <option value="300000">Hasta 300.000 €</option>
        </select>

        <select className="p-3 border rounded" value={barrio} onChange={(e) => {setBarrio(e.target.value); setCurrentPage(1);}}>
  <option value="Todos">Todos os bairros</option>
  <option value="Sarrià">Sarrià</option>
  <option value="Gràcia">Gràcia</option> 
</select>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {propiedades.length > 0 ? (
            propiedades.map(p => (
              <div key={p.id} className="border p-4 rounded shadow">
                <h3 className="font-bold">{p.titulo}</h3>
                <p className="text-indigo-600 font-black">{Number(p.precio).toLocaleString('de-DE')} €</p>
              </div>
            ))
          ) : (
            <p>Nenhuma propriedade encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}