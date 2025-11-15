/**
 * GestionInventario - Gestión de productos e inventario
 */
import React, { useState, useEffect } from 'react';
import { inventarioAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Tables.css';

const GestionInventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMovModal, setShowMovModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [movimiento, setMovimiento] = useState({
    tipo_movimiento: 'entrada',
    cantidad: '',
    motivo: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      const response = await inventarioAPI.getAll();
      setProductos(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalMovimiento = (producto) => {
    setProductoSeleccionado(producto);
    setShowMovModal(true);
  };

  const handleMovimiento = async (e) => {
    e.preventDefault();
    try {
      await inventarioAPI.registrarMovimiento(productoSeleccionado.id, {
        ...movimiento,
        usuario_id: user.id,
      });
      alert('Movimiento registrado exitosamente');
      cargarInventario();
      setShowMovModal(false);
      setMovimiento({ tipo_movimiento: 'entrada', cantidad: '', motivo: '' });
    } catch (error) {
      console.error('Error registrando movimiento:', error);
      alert('Error al registrar movimiento');
    }
  };

  if (loading) {
    return <div className="loading">Cargando inventario...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Inventario</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Stock Mínimo</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className={producto.necesita_reposicion ? 'row-warning' : ''}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>
                  <span className="badge">{producto.categoria}</span>
                </td>
                <td>
                  <strong>{producto.cantidad}</strong> {producto.unidad_medida}
                </td>
                <td>{producto.stock_minimo}</td>
                <td>Bs. {producto.precio_unitario}</td>
                <td>
                  {producto.necesita_reposicion ? (
                    <span className="status status-danger">⚠️ Bajo Stock</span>
                  ) : (
                    <span className="status status-success">✓ OK</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => abrirModalMovimiento(producto)}
                    title="Registrar movimiento"
                  >
                    📦
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMovModal && (
        <div className="modal-overlay" onClick={() => setShowMovModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Movimiento</h2>
              <button className="modal-close" onClick={() => setShowMovModal(false)}>×</button>
            </div>
            <p><strong>Producto:</strong> {productoSeleccionado?.nombre}</p>
            <p><strong>Stock Actual:</strong> {productoSeleccionado?.cantidad} {productoSeleccionado?.unidad_medida}</p>

            <form onSubmit={handleMovimiento}>
              <div className="form-group">
                <label>Tipo de Movimiento</label>
                <select
                  value={movimiento.tipo_movimiento}
                  onChange={(e) => setMovimiento({ ...movimiento, tipo_movimiento: e.target.value })}
                  required
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={movimiento.cantidad}
                  onChange={(e) => setMovimiento({ ...movimiento, cantidad: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Motivo</label>
                <textarea
                  value={movimiento.motivo}
                  onChange={(e) => setMovimiento({ ...movimiento, motivo: e.target.value })}
                  required
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMovModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionInventario;
