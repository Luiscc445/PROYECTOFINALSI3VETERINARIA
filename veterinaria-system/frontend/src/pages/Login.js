/**
 * Login - Página de inicio de sesión
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Autenticación real contra el backend
      const response = await authAPI.login({
        email,
        password: password  // Enviar password directamente (sin hash)
      });

      // Si la autenticación es exitosa, recibimos los datos del usuario
      const userData = response.data;
      login(userData);

      // Redirigir según el rol del usuario
      if (userData.rol_nombre === 'administrador') {
        navigate('/admin');
      } else if (userData.rol_nombre === 'veterinario') {
        navigate('/veterinario');
      } else if (userData.rol_nombre === 'tutor') {
        navigate('/tutor');
      } else {
        navigate('/'); // Redirigir a home si no tiene un rol conocido
      }
    } catch (err) {
      // Manejar errores de autenticación
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.response && err.response.status === 401) {
        setError('Credenciales inválidas');
      } else {
        setError('Error al iniciar sesión. Por favor, intente nuevamente.');
      }
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🐾 Sistema Veterinaria</h1>
          <p>Gestión integral de mascotas y clínica</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@ejemplo.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="test-users">
          <h3>Usuarios de Prueba:</h3>
          <ul>
            <li><strong>Administrador:</strong> admin@veterinaria.com / admin123</li>
            <li><strong>Veterinario:</strong> vet1@veterinaria.com / vet123</li>
            <li><strong>Tutor:</strong> tutor1@gmail.com / tutor123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
