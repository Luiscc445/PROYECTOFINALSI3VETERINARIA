/**
 * ToastContext - Contexto de notificaciones toast
 * Maneja notificaciones de éxito, error e info en toda la aplicación
 */
import React, { createContext, useState, useContext, useCallback } from 'react';
import '../styles/Toast.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Agregar un toast
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-eliminar el toast después de la duración especificada
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Eliminar un toast específico
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Atajos para tipos comunes
  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Componente para mostrar los toasts
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Componente individual de toast
const Toast = ({ toast, onClose }) => {
  const { message, type } = toast;

  // Configuración de colores según el tipo
  const typeStyles = {
    success: {
      bg: 'bg-green-500',
      icon: '✓',
      border: 'border-green-600',
    },
    error: {
      bg: 'bg-red-500',
      icon: '✕',
      border: 'border-red-600',
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: '⚠',
      border: 'border-yellow-600',
    },
    info: {
      bg: 'bg-blue-500',
      icon: 'ℹ',
      border: 'border-blue-600',
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className={`toast ${style.bg} ${style.border} toast-${type}`}>
      <div className="toast-icon">{style.icon}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};
