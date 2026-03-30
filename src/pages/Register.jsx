import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '../components/AppBar';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          whatsapp: form.whatsapp,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Guardar en tabla clients
    if (data.user) {
      await supabase.from('clients').insert({
        id: data.user.id,
        name: form.name,
        whatsapp: form.whatsapp,
        email: form.email,
      });
    }

    setLoading(false);
    navigate('/');
  };

  return (
    <div className="auth-bg">
      <AppBar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Crear cuenta</h2>
            <p className="auth-subtitle">Únete y reserva tu estadía en Casa Sanue</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="name"
                placeholder="María López"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                placeholder="+57 300 123 4567"
                value={form.whatsapp}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-link">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
