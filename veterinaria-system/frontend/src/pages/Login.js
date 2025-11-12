/**
 * Login - Página de inicio de sesión
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Usuarios de prueba (simulación - en producción esto vendría del backend)
  const usuariosPrueba = [
    { email: 'admin@veterinaria.com', password: 'admin123', rol_nombre: 'administrador', nombre_completo: 'Admin Sistema', id: 1 },
    { email: 'vet1@veterinaria.com', password: 'vet123', rol_nombre: 'veterinario', nombre_completo: 'Dr. Carlos Méndez', id: 2 },
    { email: 'tutor1@gmail.com', password: 'tutor123', rol_nombre: 'tutor', nombre_completo: 'Juan Pérez', id: 4 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulación de login (en producción usar authAPI.login)
      const usuario = usuariosPrueba.find(
        u => u.email === email && u.password === password
      );

      if (usuario) {
        const { password, ...userData } = usuario;
        login(userData);

        // Redirigir según el rol
        if (usuario.rol_nombre === 'administrador') {
          navigate('/admin');
        } else if (usuario.rol_nombre === 'veterinario') {
          navigate('/veterinario');
        } else if (usuario.rol_nombre === 'tutor') {
          navigate('/tutor');
        }
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
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
