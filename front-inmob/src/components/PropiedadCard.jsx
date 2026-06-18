import React from 'react';

export default function PropiedadCard({ propiedad }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Imagen Placeholder - En el futuro aquí irá la foto real */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {propiedad.operacion}
        </div>
      </div>
      
      {/* Información */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">
          {propiedad.titulo}
        </h3>
        <p className="text-gray-500 text-sm mb-4">📍 {propiedad.barrio}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-black text-gray-900">
            {Number(propiedad.precio).toLocaleString('de-DE')} €
          </span>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors">
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
}