import React, { useEffect } from 'react';
import './ModalTerminos.css';

export default function ModalTerminos({ isOpen, onClose, onAccept }) {
  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
      >
        {/* Botón X superior */}
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <div className="icon-circle">📜</div>
          <div>
            <h2>Términos y Condiciones</h2>
            <p>Casa Sanué • Contrato de Reserva</p>
          </div>
        </div>

        <div className="modal-body">
          <section>
            <h3>1. Confirmación y Pagos</h3>
            <p>Para confirmar tu reserva, es necesario el pago del <strong>50% del valor total</strong>. El saldo restante se cancelará al momento del ingreso (Check-in).</p>
          </section>

          <section>
            <h3>2. Políticas de Cancelación</h3>
            <p>Los anticipos no son reembolsables. En caso de fuerza mayor, se podrá reprogramar la fecha según disponibilidad con 7 días de antelación.</p>
          </section>

          <section>
            <h3>3. Responsabilidad</h3>
            <p>El cliente se hace responsable de cualquier daño a las instalaciones. Casa Sanué no se hace responsable por objetos de valor olvidados o perdidos.</p>
          </section>

          <section>
            <h3>4. Normas de Convivencia</h3>
            <p>El incumplimiento de las normas de ruido o exceso de personas permitidas resultará en la cancelación inmediata de la reserva sin reembolso.</p>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Regresar
          </button>
          <button 
            className="btn-accept" 
            onClick={() => { onAccept(); onClose(); }}
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}