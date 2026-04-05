import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ ok: false, error: 'RESEND_API_KEY no configurada' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // ✅ BODY SEGURO (ARREGLA TU ERROR)
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Body inválido o vacío' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { nombre, email, plan, fecha, personas, monto } = body;

    if (!nombre || !email || !plan || !fecha || !personas || monto == null) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Datos incompletos' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    console.log('BODY RECIBIDO:', body);
    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000000; color: #F1F1F1; border-radius: 12px; overflow: hidden;">
  <div style="background: #000000; padding: 32px; text-align: center; border-bottom: 2px solid #D4AF37;">
    <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">Casa Sanué</h1>
    <p style="color: rgba(241,241,241,0.6); margin: 8px 0 0;">Donde el Alma descansa</p>
  </div>
  <div style="padding: 32px;">
    <h2 style="color: #D4AF37;">¡Hola ${nombre}! 🎉</h2>
    <p>Tu reserva ha sido recibida exitosamente.</p>

    <table style="width:100%;">
      <tr><td>Plan</td><td>${plan}</td></tr>
      <tr><td>Fecha</td><td>${fecha}</td></tr>
      <tr><td>Personas</td><td>${personas}</td></tr>
      <tr><td>Total</td><td>${monto}</td></tr>
    </table>
  </div>
</div>
`;

    // 📧 ENVÍO DE EMAIL
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Casa Sanué <onboarding@resend.dev>',
        to: ['compiteamigos@gmail.com'],
        subject: '¡Tu reserva fue recibida!',
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: CORS_HEADERS,
    });

  } catch (err) {
    console.error('ERROR GENERAL:', err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});