// utils/admin.js — constantes y helpers del panel admin
import * as XLSX from 'xlsx';

export const ADMINS = ['compiteamigos@gmail.com', 'casasanue@gmail.com'];

export const ESTADOS = ['pendiente', 'confirmada', 'cancelada'];

export const ESTADO_COLOR = {
  pendiente:   '#BA7517',
  confirmada:  '#1D9E75',
  cancelada:   '#a32d2d',
};

export const PLAN_LABEL = {
  pasanoche:    '✨ Pasanoche',
  pasadia:      '🎇 Pasadía',
  alimentacion: '🌟 Alimentación',
  personalizado:'✏️ Personalizado',
};

export const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(v || 0);


export const exportarExcel = (reservas) => {
  const filas = reservas.map(r => ({
    'Plan':          r.plan,
    'Cliente':       r.clients?.name || '',
    'Email':         r.clients?.email || '',
    'WhatsApp':      r.clients?.whatsApp || '',
    'Fecha inicio':  r.start_date,
    'Fecha fin':     r.end_date,
    'Personas':      r.people,
    'Monto total':   r.monto || 0,
    'Monto pagado':  r.monto_pagado || 0,
    'Por cobrar':    (r.monto || 0) - (r.monto_pagado || 0),
    'Estado':        r.state,
    'Fecha reserva': r.created_at?.split('T')[0],
  }));

  const hoja    = XLSX.utils.json_to_sheet(filas);
  const libro   = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Reservas');
  XLSX.writeFile(libro, 'reservas_casasanue.xlsx');
};