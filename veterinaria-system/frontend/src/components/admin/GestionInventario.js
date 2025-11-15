/**
 * GestionInventario - CRUD completo de inventario
 */
import React, { useState, useEffect } from 'react';
import { inventarioAPI } from '../../services/api';
import '../../styles/Tables.css';

const GestionInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: 'medicamento',
    descripcion: '',
    cantidad: 0,
    unidad_medida: '',
    precio_unitario: '',
    stock_minimo: 0,
  });
  const [movimientoData, setMovimientoData] = useState({
    tipo_movimiento: 'entrada',
    cantidad: 0,
    motivo: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      const response = await inventarioAPI.getAll();
      setInventario(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando inventario:', error);
      alert('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        cantidad: parseInt(formData.cantidad),
        stock_minimo: parseInt(formData.stock_minimo),
        precio_unitario: parseFloat(formData.precio_unitario),
      };

      if (editingId) {
        await inventarioAPI.update(editingId, dataToSend);
      } else {
        await inventarioAPI.create(dataToSend);
      }
      cargarInventario();
      cerrarModal();
      alert('Producto guardado exitosamente');
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar producto: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleMovimiento = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        tipo_movimiento: movimientoData.tipo_movimiento,
        cantidad: parseInt(movimientoData.cantidad),
        motivo: movimientoData.motivo,
      };

      await inventarioAPI.registrarMovimiento(selectedItem.id, dataToSend);
      cargarInventario();
      cerrarMovimientoModal();
      alert('Movimiento registrado exitosamente');
    } catch (error) {
      console.error('Error registrando movimiento:', error);
      alert('Error al registrar movimiento: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await inventarioAPI.delete(id);
        cargarInventario();
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar producto');
      }
    }
  };

  const abrirModal = (item = null) => {
    if (item) {
      setFormData({
        codigo: item.codigo,
        nombre: item.nombre,
        categoria: item.categoria,
        descripcion: item.descripcion || '',
        cantidad: item.cantidad,
        unidad_medida: item.unidad_medida,
        precio_unitario: item.precio_unitario,
        stock_minimo: item.stock_minimo,
      });
      setEditingId(item.id);
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        categoria: 'medicamento',
        descripcion: '',
        cantidad: 0,
        unidad_medida: '',
        precio_unitario: '',
        stock_minimo: 0,
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const abrirMovimientoModal = (item) => {
    setSelectedItem(item);
    setMovimientoData({
      tipo_movimiento: 'entrada',
      cantidad: 0,
      motivo: '',
    });
    setShowMovimientoModal(true);
  };

  const cerrarMovimientoModal = () => {
    setShowMovimientoModal(false);
    setSelectedItem(null);
  };

  const inventarioFiltrado = filtroCategoria
    ? inventario.filter((item) => item.categoria === filtroCategoria)
    : inventario;

  if (loading) {
    return <div className="loading">Cargando inventario...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Inventario</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Todas las categorías</option>
            <option value="medicamento">Medicamentos</option>
            <option value="alimento">Alimentos</option>
            <option value="accesorio">Accesorios</option>
            <option value="equipamiento">Equipamiento</option>
          </select>
          <button className="btn btn-primary" onClick={() => abrirModal()}>
            + Nuevo Producto
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Unidad</th>
              <th>Precio Unit.</th>
              <th>Stock Mín.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventarioFiltrado.map((item) => (
              <tr key={item.id}>
                <td>{item.codigo}</td>
                <td>
                  <strong>{item.nombre}</strong>
                  {item.descripcion && (
                    <div style={{ fontSize: '0.85em', color: '#666' }}>
                      {item.descripcion}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${item.categoria}`}>
                    {item.categoria}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: item.cantidad <= item.stock_minimo ? '#e74c3c' : '#27ae60',
                    }}
                  >
                    {item.cantidad}
                  </span>
                </td>
                <td>{item.unidad_medida}</td>
                <td>${parseFloat(item.precio_unitario).toFixed(2)}</td>
                <td>{item.stock_minimo}</td>
                <td>
                  {item.cantidad <= item.stock_minimo ? (
                    <span className="status status-inactive">Bajo Stock</span>
                  ) : (
                    <span className="status status-active">Normal</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn-icon btn-info"
                    onClick={() => abrirMovimientoModal(item)}
                    title="Registrar movimiento"
                    style={{ marginRight: '5px' }}
                  >
                    📦
                  </button>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => abrirModal(item)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(item.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inventarioFiltrado.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            No hay productos en el inventario
          </div>
        )}
      </div>

      {/* Modal para crear/editar producto */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Código *</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                  placeholder="Ej: MED-001"
                />
              </div>

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Amoxicilina 500mg"
                />
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  required
                >
                  <option value="medicamento">Medicamento</option>
                  <option value="alimento">Alimento</option>
                  <option value="accesorio">Accesorio</option>
                  <option value="equipamiento">Equipamiento</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows="3"
                  placeholder="Descripción del producto"
                />
              </div>

              <div className="form-group">
                <label>Cantidad Inicial *</label>
                <input
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Unidad de Medida *</label>
                <input
                  type="text"
                  value={formData.unidad_medida}
                  onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
                  required
                  placeholder="Ej: comprimidos, ml, kg, unidades"
                />
              </div>

              <div className="form-group">
                <label>Precio Unitario *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_unitario}
                  onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
                  required
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Stock Mínimo *</label>
                <input
                  type="number"
                  value={formData.stock_minimo}
                  onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
                  required
                  min="0"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para registrar movimiento */}
      {showMovimientoModal && selectedItem && (
        <div className="modal-overlay" onClick={cerrarMovimientoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Movimiento</h2>
              <button className="modal-close" onClick={cerrarMovimientoModal}>×</button>
            </div>
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <strong>{selectedItem.nombre}</strong>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                Stock actual: {selectedItem.cantidad} {selectedItem.unidad_medida}
              </div>
            </div>
            <form onSubmit={handleMovimiento}>
              <div className="form-group">
                <label>Tipo de Movimiento *</label>
                <select
                  value={movimientoData.tipo_movimiento}
                  onChange={(e) => setMovimientoData({ ...movimientoData, tipo_movimiento: e.target.value })}
                  required
                >
                  <option value="entrada">Entrada (Aumentar stock)</option>
                  <option value="salida">Salida (Disminuir stock)</option>
                  <option value="ajuste">Ajuste (Establecer cantidad exacta)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad *</label>
                <input
                  type="number"
                  value={movimientoData.cantidad}
                  onChange={(e) => setMovimientoData({ ...movimientoData, cantidad: e.target.value })}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Motivo *</label>
                <textarea
                  value={movimientoData.motivo}
                  onChange={(e) => setMovimientoData({ ...movimientoData, motivo: e.target.value })}
                  required
                  rows="3"
                  placeholder="Ej: Compra a proveedor, Venta, Ajuste de inventario, etc."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarMovimientoModal}>
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
