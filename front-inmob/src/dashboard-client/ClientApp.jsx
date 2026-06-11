import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PropiedadService } from '../services/api';

export default function ClientApp() {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total_registros: 0, pagina_actual: 1, total_paginas: 1 });

  const [search, setSearch] = useState('');
  const [operacion, setOperacion] = useState('Todos los regímenes');
  const [precioMax, setPrecioMax] = useState('Cualquier rango');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPropiedades = useCallback(async () => {
    setLoading(true);
    
    const params = {
      page: currentPage,
      limit: 9,
      search: search.trim() !== '' ? search.trim() : undefined,
      operacion: operacion !== 'Todos los regímenes' ? operacion : undefined,
      precio_max: precioMax !== 'Cualquier rango' ? precioMax : undefined
    };

    try {
      const response = await PropiedadService.getAll(params);
      
      // CORRECCIÓN: Accedemos a response.data (el array de propiedades)
      // Si el backend devuelve { data: [...], meta: {...} }, accedemos a response.data.data
      const data = response.data?.data || response.data || [];
      const metaData = response.data?.meta || { total_registros: 0, pagina_actual: 1, total_paginas: 1 };

      setPropiedades(Array.isArray(data) ? data : []);
      setMeta(metaData);
    } catch (err) {
      console.error("❌ Error al filtrar:", err);
      setPropiedades([]); // Limpiamos el estado en caso de error
    } finally {
      setLoading(false);
    }
  }, [currentPage, operacion, precioMax, search]);

  useEffect(() => {
    fetchPropiedades();
  }, [fetchPropiedades]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPropiedades();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold">BCN<span className="text-indigo-600">Inmob</span></span>
          <Link to="/admin" className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-xl no-underline hover:bg-slate-800">
            Dashboard Interno
          </Link>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Encuentra tu inmueble</h1>
        
        <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
          <input 
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Localización o tipo..." 
            className="w-full md:w-1/3 p-2 border-b md:border-r md:border-b-0 border-slate-200 focus:outline-none"
          />
          <select value={operacion} onChange={(e) => setOperacion(e.target.value)} className="w-full md:w-1/3 p-2 bg-white">
            <option value="Todos los regímenes">Todos los regímenes</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
          <select value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} className="w-full md:w-1/3 p-2 bg-white">
            <option value="Cualquier rango">Cualquier precio</option>
            <option value="Hasta 250.000€">Hasta 250.000€</option>
            <option value="Más de 250.000€">Más de 250.000€</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Filtrar</button>
        </form>
      </header>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="text-center">Cargando propiedades...</div>
        ) : (
          // VALIDACIÓN DE SEGURIDAD ANTES DEL MAP
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(propiedades) && propiedades.length > 0 ? (
              propiedades.map((item) => (
                <div key={item.id_propiedad} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1">{item.referencia}</span>
                    <span className="text-xs font-bold uppercase">{item.operacion}</span>
                  </div>
                  <h3 className="font-bold mb-2">{item.titulo}</h3>
                  <p className="text-xl font-black">{Number(item.precio).toLocaleString('de-DE')} €</p>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-slate-500">No se encontraron resultados.</p>
            )}
          </div>
        )}

        <div className="mt-12 flex justify-center gap-4">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={meta.pagina_actual === 1} className="px-4 py-2 border rounded-xl">Anterior</button>
          <span className="self-center font-bold">{meta.pagina_actual} / {meta.total_paginas}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, meta.total_paginas))} disabled={meta.pagina_actual === meta.total_paginas} className="px-4 py-2 border rounded-xl">Siguiente</button>
        </div>
      </section>
    </div>
  );
}