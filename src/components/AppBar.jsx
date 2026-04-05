import React, { useEffect, useState } from 'react';
import './AppBar.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ADMINS } from '../utils/admin';

export default function AppBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const name = session.user.user_metadata?.name || session.user.email;
        setUserName(name);
      }
    });

    // Escuchar cambios de sesión (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const name = session.user.user_metadata?.name || session.user.email;
        setUserName(name);
      } else {
        setUser(null);
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Primera letra del nombre para el avatar
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  return (
    <div className="app-bar">
      <div className="left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img className="icon" src="/media/images/logo.png" width="80px" alt="logo" />
        <div className="texto-dorado-sombra">
          <p>Casa Sanué</p>
        </div>
      </div>

      <div className="right">
        <p className="texto-dorado-sombra nav-link" onClick={() => navigate('/')}>Home</p>
        <p className="texto-dorado-sombra nav-link">About</p>

        {user ? (
          // Usuario logueado
          <div className="user-info">
            {ADMINS.includes(user.email) && (
              <p className="texto-dorado-sombra nav-link" onClick={() => navigate('/admin')}>Admin</p>
            )}
            <div className="avatar">{initial}</div>
            <span className="texto-dorado-sombra user-name">
              {userName.split(' ')[0]}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              Salir
            </button>
          </div>
        ) : (
          // No logueado
          <>
            <p className="texto-dorado-sombra nav-link" onClick={() => navigate('/register')}>Register</p>
            <p className="texto-dorado-sombra nav-link" onClick={() => navigate('/login')}>Login</p>
          </>
        )}
      </div>
    </div>
  );
}
