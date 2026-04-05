import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useReservas } from '../hooks/useReservas';
import AppBar from '../components/AppBar';
import MetricasGrid from '../components/MetricasGrid';
import GraficaBarras from '../components/GraficaBarras';
import FiltrosAdmin from '../components/FiltrosAdmin';
import ReservaCard from '../components/ReservaCard';
import './Admin.css';
import { ADMINS, exportarExcel } from '../utils/admin';

export default function Admin() {
  const navigate = useNavigate();
  const { reservas, todasReservas, loading, filtros, setFiltros, acciones } = useReservas();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || !ADMINS.includes(session.user.email)) navigate('/');
    });
  }, []);

  return (
    <div className="admin-bg">
      <AppBar />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-titulo">Panel admin</h1>
            <p className="admin-subtitulo">Gestiona reservas y descarga los datos en Excel.</p>
          </div>
          <button
            className="btn-export"
            onClick={() => exportarExcel(todasReservas)}
            disabled={!todasReservas.length}
          >
            ⬇ Exportar Excel
          </button>
        </div>

        <MetricasGrid reservas={reservas} />
        <GraficaBarras reservas={reservas} />
        <FiltrosAdmin filtros={filtros} onChange={setFiltros} total={reservas.length} />
        {loading ? (
          <p className="admin-loading">Cargando...</p>
        ) : reservas.length ? (
          reservas.map((r) => <ReservaCard key={r.id} reserva={r} acciones={acciones} />)
        ) : (
          <p className="admin-empty">No hay reservas que mostrar.</p>
        )}
      </div>
    </div>
  );
}
