// components/admin/GraficaBarras.jsx
import React from 'react';
import { PLAN_LABEL } from '../utils/admin';

function Barras({ datos, titulo, color }) {
  const max = Math.max(...datos.map(d => d.valor), 1);
  return (
    <div className="grafica-wrap">
      <p className="grafica-titulo">{titulo}</p>
      <div className="grafica-barras">
        {datos.map((d, i) => (
          <div key={i} className="barra-item">
            <div className="barra-track">
              <div
                className="barra-fill"
                style={{ height: `${(d.valor / max) * 100}%`, background: color }}
              />
            </div>
            <span className="barra-label">{d.label}</span>
            <span className="barra-valor">{d.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GraficaBarras({ reservas }) {
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  const porPlan = Object.keys(PLAN_LABEL).map(p => ({
    label: PLAN_LABEL[p].split(' ')[1] || p,
    valor: reservas.filter(r => r.plan === p).length,
  }));

  const porMes = meses
    .map((label, i) => ({
      label,
      valor: reservas.filter(r => r.created_at && new Date(r.created_at).getMonth() === i).length,
    }))
    .filter(d => d.valor > 0);

  return (
    <div className="graficas-grid">
      <Barras datos={porPlan} titulo="Reservas por plan" color="#D4AF37" />
      {porMes.length > 0 && (
        <Barras datos={porMes} titulo="Reservas por mes" color="#1D9E75" />
      )}
    </div>
  );
}