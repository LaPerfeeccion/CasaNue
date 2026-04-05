// components/admin/FiltrosAdmin.jsx
import React from 'react';
import { ESTADOS, PLAN_LABEL } from '../utils/admin';

export default function FiltrosAdmin({ filtros, onChange, total }) {
  const set = (key, val) => onChange({ ...filtros, [key]: val });

  return (
    <div className="filtros-wrap">
      <input
        className="filtro-input"
        placeholder="Buscar cliente..."
        value={filtros.busqueda}
        onChange={e => set('busqueda', e.target.value)}
      />
      <select className="filtro-select" value={filtros.estado} onChange={e => set('estado', e.target.value)}>
        <option value="todos">Todos los estados</option>
        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
      </select>
      <select className="filtro-select" value={filtros.plan} onChange={e => set('plan', e.target.value)}>
        <option value="todos">Todos los planes</option>
        {Object.entries(PLAN_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <span className="filtro-count">{total} reserva(s)</span>
    </div>
  );
}