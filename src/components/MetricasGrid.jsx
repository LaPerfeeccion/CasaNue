// components/admin/MetricasGrid.jsx
import React from 'react';
import { formatCOP } from '../utils/admin';

function Metrica({ label, valor, color }) {
  return (
    <div className="metrica-card">
      <p className="metrica-label">{label}</p>
      <p className={`metrica-valor ${color || ''}`}>{valor}</p>
    </div>
  );
}

export default function MetricasGrid({ reservas }) {
  const total       = reservas.length;
  const pendientes  = reservas.filter(r => r.state === 'pendiente').length;
  const confirmadas = reservas.filter(r => r.state === 'confirmada').length;
  const estimado    = reservas.reduce((s, r) => s + (r.monto || 0), 0);
  const recaudado   = reservas.reduce((s, r) => s + (r.monto_pagado || 0), 0);
  const porRecaudar = estimado - recaudado;

  return (
    <div className="metricas-grid">
      <Metrica label="Total reservas"      valor={total}                  />
      <Metrica label="Pendientes"          valor={pendientes}  color="amarillo" />
      <Metrica label="Confirmadas"         valor={confirmadas} color="verde"    />
      <Metrica label="Ingresos estimados"  valor={formatCOP(estimado)}   color="dorado" />
      <Metrica label="Total recaudado"     valor={formatCOP(recaudado)}  color="verde"  />
      <Metrica label="Por recaudar"        valor={formatCOP(porRecaudar)} color="rojo"  />
    </div>
  );
}