/**
 * Login - Página de inicio de sesión
 * REAL API - Conexión con backend Django
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Login con API real
      const result = await login(email, password);

      if (result.success) {
        success('Bienvenido al sistema');

        // Redirigir según el rol
        const rol = result.user.rol_nombre;
        if (rol === 'administrador') {
          navigate('/admin');
        } else if (rol === 'veterinario') {
          navigate('/veterinario');
        } else if (rol === 'tutor') {
          navigate('/tutor');
        }
      } else {
        setError(result.error);
        showError(result.error);
      }
    } catch (err) {
      const errorMsg = 'Error al iniciar sesión. Por favor, intente nuevamente.';
      setError(errorMsg);
      showError(errorMsg);
      console.error(err);
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
          <h3>Información de Acceso:</h3>
          <p>Use las credenciales proporcionadas por el administrador del sistema.</p>
          <p><small>Autenticación con bcrypt - Sistema de producción</small></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
