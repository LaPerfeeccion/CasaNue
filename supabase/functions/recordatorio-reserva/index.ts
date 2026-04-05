// supabase/functions/recordatorio-reserva/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY    = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const PLAN_LABEL: Record<string, string> = {
  pasanoche:    '✨ Pasanoche',
  pasadia:      '🎇 Pasadía',
  alimentacion: '🌟 Pasadía con Alimentación',
  personalizado:'✏️ Plan Personalizado',
};

const formatCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);

    // Buscar reservas cuya fecha de inicio sea en exactamente 3 días
    const hoy = new Date();
    const en3dias = new Date(hoy);
    en3dias.setDate(hoy.getDate() + 3);
    const fechaObjetivo = en3dias.toISOString().split('T')[0];

    const { data: reservas, error } = await supabase
      .from('reservations')
      .select(`*, clients(name, email, "whatsApp")`)
      .eq('start_date', fechaObjetivo)
      .eq('state', 'confirmada');

    if (error) throw error;
    if (!reservas || reservas.length === 0) {
      return new Response(JSON.stringify({ ok: true, enviados: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let enviados = 0;

    for (const r of reservas) {
      const nombre = r.clients?.name || 'Cliente';
      const email  = r.clients?.email;
      if (!email) continue;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a0a05; color: #F1F1F1; border-radius: 12px; overflow: hidden;">
          <div style="background: #2c1a0e; padding: 32px; text-align: center; border-bottom: 2px solid #D4AF37;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">Casa Sanué</h1>
            <p style="color: rgba(241,241,241,0.6); margin: 8px 0 0;">Donde el Alma descansa</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #D4AF37; margin: 0 0 16px;">¡Hola ${nombre}! 🌿</h2>
            <p style="color: rgba(241,241,241,0.8); line-height: 1.6;">
              Te recordamos que tu visita a Casa Sanué es <strong style="color: #D4AF37;">en 3 días</strong>. ¡Ya casi es momento de descansar!
            </p>
            <div style="background: rgba(0, 0, 0, 0.08); border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #D4AF37; margin: 0 0 16px; font-size: 16px;">Tu reserva</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: rgba(241,241,241,0.5); padding: 6px 0; font-size: 14px;">Plan</td>
                  <td style="color: #F1F1F1; font-weight: bold; font-size: 14px;">${PLAN_LABEL[r.plan] || r.plan}</td>
                </tr>
                <tr>
                  <td style="color: rgba(241,241,241,0.5); padding: 6px 0; font-size: 14px;">Fecha</td>
                  <td style="color: #F1F1F1; font-weight: bold; font-size: 14px;">${r.start_date}</td>
                </tr>
                <tr>
                  <td style="color: rgba(241,241,241,0.5); padding: 6px 0; font-size: 14px;">Personas</td>
                  <td style="color: #F1F1F1; font-weight: bold; font-size: 14px;">${r.people}</td>
                </tr>
                <tr style="border-top: 1px solid rgb(212, 175, 55);">
                  <td style="color: rgba(241,241,241,0.5); padding: 10px 0 6px; font-size: 14px;">Segunda cuota pendiente</td>
                  <td style="color: #D4AF37; font-weight: bold; font-size: 16px;">${formatCOP((r.monto || 0) / 2)}</td>
                </tr>
              </table>
            </div>
            <p style="color: rgba(241,241,241,0.6); font-size: 13px; line-height: 1.6;">
              💳 Recuerda que la segunda cuota se paga al llegar.<br/>
              📍 Si tienes alguna pregunta, responde este correo o escríbenos por WhatsApp.
            </p>
          </div>
          <div style="background: #000000; padding: 20px; text-align: center; border-top: 1px solid rgb(212, 175, 55);">
            <p style="color: rgba(241,241,241,0.3); font-size: 12px; margin: 0;">Casa Sanué · casasanue@gmail.com</p>
          </div>
        </div>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Casa Sanué <onboarding@resend.dev>',
          to: [email],
          subject: '🏡 Tu visita a Casa Sanué es en 3 días',
          html,
        }),
      });

      enviados++;
    }

    return new Response(JSON.stringify({ ok: true, enviados }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});