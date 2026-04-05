// hooks/useReservas.js — toda la lógica de reservas con Supabase
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useReservas() {
  const [todasReservas, setTodasReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ estado: 'todos', plan: 'todos', busqueda: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reservations')
      .select(`*, clients(name, email, "whatsApp")`)
      .order('created_at', { ascending: false });
    setTodasReservas(data || []);
    setLoading(false);
  };

  // Filtrar reservas según los filtros activos
  const reservas = todasReservas.filter(r => {
    const okEstado  = filtros.estado === 'todos' || r.state === filtros.estado;
    const okPlan    = filtros.plan   === 'todos' || r.plan  === filtros.plan;
    const okBusq    = !filtros.busqueda ||
      r.clients?.name?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      r.clients?.email?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    return okEstado && okPlan && okBusq;
  });

  // Acciones sobre una reserva
  const acciones = {
    cambiarEstado: async (id, nuevoEstado) => {
      await supabase.from('reservations').update({ state: nuevoEstado }).eq('id', id);
      setTodasReservas(prev => prev.map(r => r.id === id ? { ...r, state: nuevoEstado } : r));
    },
    marcarPrimeraCuota: async (id, monto) => {
      const mitad = (monto || 0) / 2;
      await supabase.from('reservations').update({ monto_pagado: mitad }).eq('id', id);
      setTodasReservas(prev => prev.map(r => r.id === id ? { ...r, monto_pagado: mitad } : r));
    },
    marcarSegundaCuota: async (id, monto) => {
      await supabase.from('reservations')
        .update({ monto_pagado: monto, segunda_cuota_pagada: true, state: 'confirmada' })
        .eq('id', id);
      setTodasReservas(prev => prev.map(r =>
        r.id === id ? { ...r, monto_pagado: monto, segunda_cuota_pagada: true, state: 'confirmada' } : r
      ));
    },
    pedirConfirmDelete: (id) => setConfirmDelete(id),
    cancelarDelete: () => setConfirmDelete(null),
    eliminar: async (id) => {
      await supabase.from('reservations').delete().eq('id', id);
      setTodasReservas(prev => prev.filter(r => r.id !== id));
      setConfirmDelete(null);
    },
    confirmDelete,
  };

  return { reservas, todasReservas, loading, filtros, setFiltros, acciones };
}