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
      // Llamar al backend real
      const response = await authAPI.login({ email, password });
      const userData = response.data.user;

      // Guardar usuario en contexto
      login(userData);

      // Redirigir según el rol
      if (userData.rol_nombre === 'administrador') {
        navigate('/admin');
      } else if (userData.rol_nombre === 'veterinario') {
        navigate('/veterinario');
      } else if (userData.rol_nombre === 'tutor') {
        navigate('/tutor');
      } else {
        setError('Rol de usuario no reconocido');
      }
    } catch (err) {
      console.error('Error en login:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError('Credenciales inválidas');
      } else {
        setError('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
      }
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
            <li><strong>Administrador:</strong> admin@vetclinic.com / admin123</li>
            <li><strong>Veterinario:</strong> dra.garcia@vetclinic.com / vet123</li>
            <li><strong>Tutor:</strong> juan.perez@gmail.com / tutor123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
