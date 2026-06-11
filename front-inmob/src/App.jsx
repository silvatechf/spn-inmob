import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientApp from './dashboard-client/ClientApp.jsx';
import AdminApp from './dashboard-admin/AdminApp.jsx';

export default function App() {
  return (
    <Routes>
      {/* Portal de Clientes con Tailwind */}
      <Route path="/*" element={<ClientApp />} />

      {/* Portal de Administración con Bootstrap */}
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}