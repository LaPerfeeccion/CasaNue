// components/admin/ReservaCard.jsx
import React from 'react';
import { ESTADOS, ESTADO_COLOR, PLAN_LABEL, formatCOP } from '../utils/admin';

export default function ReservaCard({ reserva: r, acciones }) {
  const esDeletingThis = acciones.confirmDelete === r.id;

  return (
    <div className="reserva-card">

      {/* Encabezado */}
      <div className="reserva-top">
        <div className="reserva-info">
          <span className="reserva-plan">{PLAN_LABEL[r.plan] || r.plan}</span>
          <span className="reserva-fecha">
            {r.start_date}
            {r.end_date && r.end_date !== r.start_date ? ` → ${r.end_date}` : ''}
          </span>
        </div>
        <span
          className="reserva-estado"
          style={{
            background: ESTADO_COLOR[r.state] + '22',
            color: ESTADO_COLOR[r.state],
            border: `1px solid ${ESTADO_COLOR[r.state]}44`,
          }}
        >
          {r.state}
        </span>
      </div>

      {/* Datos del cliente */}
      <div className="reserva-cliente">
        <span>👤 {r.clients?.name || 'Sin nombre'}</span>
        <span>✉️ {r.clients?.email || '—'}</span>
        <span>📱 {r.clients?.whatsApp || '—'}</span>
        <span>👥 {r.people} personas</span>
      </div>

      {/* Estado de pagos */}
      <div className="reserva-pagos">
        <div className="pago-item">
          <span className="pago-label">Total estimado</span>
          <span className="pago-valor dorado">{formatCOP(r.monto)}</span>
        </div>
        <div className="pago-item">
          <span className="pago-label">1ra cuota (50%)</span>
          <span className={`pago-valor ${r.monto_pagado > 0 ? 'verde' : 'gris'}`}>
            {r.monto_pagado > 0 ? `✅ ${formatCOP(r.monto_pagado)}` : 'Pendiente'}
          </span>
        </div>
        <div className="pago-item">
          <span className="pago-label">2da cuota (50%)</span>
          <span className={`pago-valor ${r.segunda_cuota_pagada ? 'verde' : 'gris'}`}>
            {r.segunda_cuota_pagada ? '✅ Pagada' : 'Pendiente'}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="reserva-acciones">
        <select
          className="select-estado"
          value={r.state}
          onChange={e => acciones.cambiarEstado(r.id, e.target.value)}
          style={{ borderColor: ESTADO_COLOR[r.state] }}
        >
          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        {!r.monto_pagado && (
          <button className="btn-accion verde" onClick={() => acciones.marcarPrimeraCuota(r.id, r.monto)}>
            ✓ 1ra cuota
          </button>
        )}

        {r.monto_pagado > 0 && !r.segunda_cuota_pagada && (
          <button className="btn-accion verde" onClick={() => acciones.marcarSegundaCuota(r.id, r.monto)}>
            ✓ 2da cuota
          </button>
        )}

        {esDeletingThis ? (
          <div className="confirm-delete">
            <span>¿Eliminar?</span>
            <button className="btn-accion rojo" onClick={() => acciones.eliminar(r.id)}>Sí</button>
            <button className="btn-accion gris" onClick={acciones.cancelarDelete}>No</button>
          </div>
        ) : (
          <button className="btn-accion rojo" onClick={() => acciones.pedirConfirmDelete(r.id)}>
            🗑 Eliminar
          </button>
        )}
      </div>

    </div>
  );
}