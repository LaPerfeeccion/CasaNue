import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Alert, CloseButton } from '@heroui/react';
import AppBar from '../components/AppBar';
import './Reservations.css';
import ModalTerminos from '../components/ModalTerminos';

const formatCOP = (valor) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);

const LIMITES = {
  pasanoche: { min: 10, max: 50 },
  pasadia: { min: 10, max: 50 },
  alimentacion: { min: 10, max: 50 },
  personalizado: { min: 15, max: 50 }
};

const calcularMontoBase = ({ plan, adultos, ninosPagantes, horasExtra, noches = 1 }) => {
  const personas = adultos + ninosPagantes;
  if (plan === 'pasanoche') {
    const includedPeople = 10;
    const extraAdults = Math.max(0, adultos - includedPeople);
    const extraChildren = Math.max(0, personas - includedPeople - extraAdults);
    return (600000 + extraAdults * 60000 + extraChildren * 30000 + horasExtra * 70000) * noches;
  }
  if (plan === 'pasadia') {
    const includedPeople = 10;
    const extraAdults = Math.max(0, adultos - includedPeople);
    const extraChildren = Math.max(0, personas - includedPeople - extraAdults);
    return 450000 + extraAdults * 45000 + extraChildren * 30000 + horasExtra * 70000;
  }
  if (plan === 'alimentacion') {
    return adultos * 90000 + ninosPagantes * 65000 + horasExtra * 70000;
  }
  if (plan === 'personalizado') {
    const base = adultos <= 15 ? adultos * 80000 : 15 * 80000 + (adultos - 15) * 100000;
    return (base + ninosPagantes * 30000) * noches;
  }
  return 0;
};

const calcularDescuento = (plan, noches) => {
  if (plan !== 'personalizado') return 0;
  if (noches >= 14) return 20;
  if (noches >= 7) return 10;
  if (noches >= 3) return 5;
  return 0;
};

const PLANES = [
  {
    id: 'pasanoche',
    emoji: '✨',
    nombre: 'Pasanoche',
    precio: 'COP 600.000',
    descripcion: 'Para 20 personas · 6pm – 6am',
    horario: '6:00 pm – 6:00 am',
    dias: 'Todos los días',
    incluye: [
      'Kiosco, zonas verdes, piscina',
      'Zona BBQ con implementos básicos',
      '1 baño',
      'Muebles y 3 hamacas en el Kiosco'
    ],
    noIncluye: ['Acceso a habitaciones', 'Comida'],
    extras: [
      'Niños de 3 a 10 años: $30.000',
      'Persona adicional: $60.000',
      'Hora adicional: $70.000 (sujeto a disponibilidad)'
    ],
    color: '#D4AF37'
  },
  {
    id: 'pasadia',
    emoji: '🎇',
    nombre: 'Pasadía',
    precio: 'COP 450.000',
    descripcion: 'Para 20 personas · 9am – 5pm',
    horario: '9:00 am – 5:00 pm',
    dias: 'Lunes a Jueves',
    incluye: ['Kiosco, zonas verdes, piscina', 'Zona BBQ con implementos básicos', '1 baño'],
    noIncluye: ['Acceso a habitaciones'],
    extras: ['Niños de 3 a 10 años: $30.000', 'Persona adicional: $45.000', 'Hora adicional: $70.000'],
    color: '#D4AF37'
  },
  {
    id: 'alimentacion',
    emoji: '🌟',
    nombre: 'Pasadía con Alimentación',
    precio: 'COP 90.000 / persona',
    descripcion: 'Plato fuerte + comida + postre',
    horario: 'Según disponibilidad',
    dias: 'Consultar disponibilidad',
    incluye: [
      'Kiosco, zonas verdes, piscina',
      'Zona BBQ con implementos básicos',
      '1 baño',
      'Alimentación completa por persona'
    ],
    noIncluye: ['Acceso a habitaciones'],
    extras: ['Niños de 3 a 10 años: $65.000', 'Hora adicional: $70.000'],
    color: '#D4AF37'
  }
];

// ─── Formulario ───────────────────────────────────────────────────────────────
function FormularioReserva({ plan, user, onVolver }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const esPersonalizado = plan.id === 'personalizado';
  const limites = LIMITES[plan.id];

  const [form, setForm] = useState({
    fecha: '',
    fecha_fin: '',
    adultos: limites.min,
    ninosPagantes: 0,
    ninosGratis: 0,
    horasExtra: 0,
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const adultos = parseInt(form.adultos) || 0;
  const ninosPagantes = parseInt(form.ninosPagantes) || 0;
  const ninosGratis = parseInt(form.ninosGratis) || 0;
  const horasExtra = parseInt(form.horasExtra) || 0;
  const totalPersonas = adultos + ninosPagantes + ninosGratis;

  const noches =
    esPersonalizado && form.fecha && form.fecha_fin
      ? Math.max(1, (new Date(form.fecha_fin) - new Date(form.fecha)) / 86400000)
      : 1;

  const childPrice = plan.id === 'alimentacion' ? 65000 : 30000;
  const childLabel = `Niños 3-10 años (${formatCOP(childPrice)})`;
  const baseMonto = calcularMontoBase({ plan: plan.id, adultos, ninosPagantes, horasExtra, noches });
  const descuentoPorcentaje = calcularDescuento(plan.id, noches);
  const descuentoValor = Math.round((baseMonto * descuentoPorcentaje) / 100);
  const monto = baseMonto - descuentoValor;
  const tieneDescuento = descuentoPorcentaje > 0;

  const personasPagantes = adultos + ninosPagantes;
  const superaLimite = personasPagantes > limites.max;
  const bajoMinimo = personasPagantes < limites.min;
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!aceptaTerminos) {
      return setError('Debes aceptar los términos y condiciones');
    }
    if (bajoMinimo) return setError(`El mínimo de personas es ${limites.min}.`);
    if (superaLimite) return setError(`El máximo para este plan es ${limites.max}.`);
    if (esPersonalizado && form.fecha_fin <= form.fecha)
      return setError('La fecha de salida debe ser después de la llegada.');

    setLoading(true);

    const { error: insertError } = await supabase.from('reservations').insert({
      client_id: user.id,
      start_date: form.fecha,
      end_date: esPersonalizado ? form.fecha_fin : form.fecha,
      people: totalPersonas,
      plan: plan.id,
      ninos_pagantes: ninosPagantes,
      ninos_gratis: ninosGratis,
      horas_adicionales: horasExtra,
      monto,
      state: 'pendiente'
    });

    setLoading(false);

    if (insertError) {
      return setError('Error al crear la reserva.');
    }

    // 🔥 ENVÍO DE EMAIL CORRECTO
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirmar-reserva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          nombre: user.user_metadata?.name || 'Cliente',
          email: user.email,
          plan: plan.id,
          fecha: form.fecha,
          personas: totalPersonas,
          monto: monto
        })
      });

      // 👇 Manejo seguro de JSON
      let data = null;
      try {
        data = await res.json();
      } catch {
        console.warn('Respuesta no es JSON');
      }

      console.log('Respuesta función:', data);

      if (!res.ok) {
        console.error('Error HTTP:', res.status);
      }
    } catch (err) {
      console.warn('Email no enviado:', err);
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="res-card">
        <div className="alert-success">
          <h3>¡Reserva enviada con éxito!</h3>
          <p>Pronto nos contactaremos contigo para confirmar los detalles</p>
        </div>
        <button className="btn-volver" onClick={onVolver}>
          ← Volver a planes
        </button>
      </div>
    );
  }

  return (
    <div className="res-card">
      <button className="btn-volver" onClick={onVolver}>
        ← Volver a planes
      </button>
      <div className="plan-badge" style={{ '--plan-color': plan.color }}>
        {plan.emoji} {plan.nombre}
      </div>
      <h2 className="res-title">Completa tu reserva</h2>
      <p className="res-subtitle">
        {plan.horario} · {plan.dias} · Mín {limites.min} / Máx {limites.max} personas
      </p>

      {error && <div className="res-error">{error}</div>}

      <form onSubmit={handleSubmit} className="res-form">
        {esPersonalizado ? (
          <div className="res-row">
            <div className="input-group">
              <label>Fecha de llegada</label>
              <input type="date" name="fecha" value={form.fecha} onChange={handleChange} min={today} required />
            </div>
            <div className="input-group">
              <label>Fecha de salida</label>
              <input
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                min={form.fecha || today}
                required
              />
            </div>
          </div>
        ) : (
          <div className="input-group">
            <label>Fecha</label>
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} min={today} required />
          </div>
        )}

        <div className="res-row">
          <div className="input-group">
            <label>Adultos</label>
            <input
              type="number"
              name="adultos"
              value={form.adultos}
              onChange={handleChange}
              min={1}
              max={limites.max}
              required
            />
          </div>
          <div className="input-group">
            <label>{childLabel}</label>
            <input
              type="number"
              name="ninosPagantes"
              value={form.ninosPagantes}
              onChange={handleChange}
              min={0}
              max={30}
            />
          </div>
        </div>

        <div className="res-row">
          <div className="input-group">
            <label>Niños menores de 3 años (gratis)</label>
            <input type="number" name="ninosGratis" value={form.ninosGratis} onChange={handleChange} min={0} max={20} />
          </div>
          {!esPersonalizado && (
            <div className="input-group">
              <label>Horas adicionales ($70.000/h)</label>
              <input type="number" name="horasExtra" value={form.horasExtra} onChange={handleChange} min={0} max={10} />
            </div>
          )}
        </div>

        {esPersonalizado && (
          <div className="input-group">
            <label>¿Qué tienes en mente? (opcional)</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Cuéntanos qué tipo de evento o estadía deseas..."
              className="res-textarea"
            />
          </div>
        )}

        <div className={`personas-indicator ${superaLimite ? 'excede' : bajoMinimo ? 'bajo' : 'ok'}`}>
          <span>👥 {totalPersonas} personas en total</span>
          <span className="personas-limite">
            Límite: {limites.min}–{limites.max}
          </span>
        </div>

        {!bajoMinimo && !superaLimite && (
          <div className="res-resumen">
            {esPersonalizado && noches > 1 && (
              <div className="resumen-fila">
                <span className="resumen-label">Noches</span>
                <span className="resumen-valor">{noches}</span>
              </div>
            )}
            <div className="resumen-fila">
              <span className="resumen-label">Adultos</span>
              <span className="resumen-valor">{adultos}</span>
            </div>
            {ninosPagantes > 0 && (
              <div className="resumen-fila">
                <span className="resumen-label">Niños 3-10 años</span>
                <span className="resumen-valor">
                  {ninosPagantes} × {formatCOP(childPrice)}
                </span>
              </div>
            )}
            {ninosGratis > 0 && (
              <div className="resumen-fila">
                <span className="resumen-label">Niños menores de 3 años</span>
                <span className="resumen-valor">{ninosGratis} × Gratis</span>
              </div>
            )}
            {horasExtra > 0 && (
              <div className="resumen-fila">
                <span className="resumen-label">{horasExtra} hora(s) adicional(es)</span>
                <span className="resumen-valor">+ {formatCOP(horasExtra * 70000)}</span>
              </div>
            )}
            {tieneDescuento && (
              <>
                <div className="resumen-fila">
                  <span className="resumen-label">Precio sin descuento</span>
                  <span className="resumen-valor">{formatCOP(baseMonto)}</span>
                </div>
                <div className="resumen-fila">
                  <span className="resumen-label">Descuento ({descuentoPorcentaje}%)</span>
                  <span className="resumen-valor">- {formatCOP(descuentoValor)}</span>
                </div>
              </>
            )}
            <div className="resumen-divider" />
            <div className="resumen-fila resumen-total">
              <span>Total estimado</span>
              <span>{formatCOP(monto)}</span>
            </div>
          </div>
        )}
        <button
          type="button"
          className="btn-terminos"
          onClick={() => setModalVisible(true)}
        >
          📜 Leer Términos y Condiciones
        </button>
        <ModalTerminos
  isOpen={modalVisible}
  onClose={() => setModalVisible(false)}
  onAccept={() => setAceptaTerminos(true)}
/>
        <button type="submit" className="btn-reservar" disabled={loading || superaLimite || bajoMinimo}>
          {loading ? 'Enviando reserva...' : 'Confirmar reserva'}
        </button>
      </form>

      <p className="res-nota">* El total es un estimado. El precio final se confirma con Casa Sanué.</p>
    </div>
  );
}

// ─── Principal ────────────────────────────────────────────────────────────────
export default function Reservations() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
      else setUser(session.user);
    });
  }, [navigate]);

  if (planSeleccionado) {
    return (
      <div className="res-bg">
        <AppBar />
        <div className="res-container">
          <FormularioReserva plan={planSeleccionado} user={user} onVolver={() => setPlanSeleccionado(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="res-bg">
      <AppBar />
      <div className="planes-container">
        <h2 className="planes-titulo">Elige tu plan</h2>
        <p className="planes-subtitulo">Selecciona la experiencia que quieres vivir en Casa Sanué</p>

        <div className="planes-grid">
          {PLANES.map((plan) => (
            <div key={plan.id} className="plan-card" style={{ '--plan-color': plan.color }}>
              <div className="plan-header">
                <span className="plan-emoji">{plan.emoji}</span>
                <h3 className="plan-nombre">{plan.nombre}</h3>
                <p className="plan-precio">{plan.precio}</p>
                <p className="plan-descripcion">{plan.descripcion}</p>
              </div>
              <div className="plan-body">
                <p className="plan-seccion-label">Incluye</p>
                <ul className="plan-lista">
                  {plan.incluye.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="plan-seccion-label">No incluye</p>
                <ul className="plan-lista plan-lista-no">
                  {plan.noIncluye.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="plan-seccion-label">Extras</p>
                <ul className="plan-lista plan-lista-extras">
                  {plan.extras.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div className="plan-horario">
                  <span>🕰 {plan.horario}</span>
                  <span>📅 {plan.dias}</span>
                  <span>
                    👥 Mín {LIMITES[plan.id].min} / Máx {LIMITES[plan.id].max} personas
                  </span>
                </div>
              </div>
              <button className="btn-elegir Btn" onClick={() => setPlanSeleccionado(plan)}></button>
            </div>
          ))}
        </div>

        <div className="personalizado-wrap">
          <p className="personalizado-texto">¿Tienes algo diferente en mente?</p>
          <button
            className="btn-personalizado"
            onClick={() =>
              setPlanSeleccionado({
                id: 'personalizado',
                emoji: '✏️',
                nombre: 'Plan personalizado',
                precio: 'Desde $80.000/persona',
                descripcion: 'Personaliza tu estadía',
                horario: 'A convenir',
                dias: 'Según disponibilidad',
                color: '#dfab1c'
              })
            }
          >
            ✏️ Crear plan personalizado
          </button>
        </div>
      </div>
    </div>
  );
}
