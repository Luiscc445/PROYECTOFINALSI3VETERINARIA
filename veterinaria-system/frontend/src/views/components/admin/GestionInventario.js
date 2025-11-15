/**
 * GestionInventario - CRUD COMPLETO de inventario
 * El Admin puede crear, ver, editar productos y registrar movimientos
 * Arquitectura MVC - Vista de Admin
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { inventarioAPI, movimientosAPI } from '../../../models/api';
import '../../../styles/Tables.css';

const GestionInventario = () => {
  const { success, error: showError } = useToast();
  const { user } = useAuth();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    descripcion: '',
    cantidad: 0,
    unidad_medida: '',
    precio_unitario: '',
    stock_minimo: 10,
    fecha_vencimiento: '',
    proveedor: '',
    activo: true,
  });

  const [movimientoData, setMovimientoData] = useState({
    tipo_movimiento: '',
    cantidad: '',
    motivo: '',
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productos = await inventarioAPI.getAll();
      setProductos(productos);
    } catch (error) {
      console.error('Error cargando productos:', error);
      showError('Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMovimientoChange = (e) => {
    const { name, value } = e.target;
    setMovimientoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.codigo || !formData.nombre || !formData.categoria) {
      showError('Complete todos los campos requeridos');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        cantidad: parseInt(formData.cantidad),
        precio_unitario: parseFloat(formData.precio_unitario),
        stock_minimo: parseInt(formData.stock_minimo),
      };

      if (editingId) {
        await inventarioAPI.update(editingId, dataToSend);
        success('Producto actualizado exitosamente');
      } else {
        await inventarioAPI.create(dataToSend);
        success('Producto creado exitosamente');
      }

      setShowModal(false);
      resetForm();
      cargarProductos();
    } catch (error) {
      console.error('Error guardando producto:', error);
      showError('Error al guardar el producto');
    }
  };

  const handleMovimientoSubmit = async (e) => {
    e.preventDefault();

    if (!movimientoData.tipo_movimiento || !movimientoData.cantidad || !movimientoData.motivo) {
      showError('Complete todos los campos del movimiento');
      return;
    }

    try {
      await inventarioAPI.registrarMovimiento(selectedProducto.id, {
        tipo_movimiento: movimientoData.tipo_movimiento,
        cantidad: parseInt(movimientoData.cantidad),
        motivo: movimientoData.motivo,
        usuario_id: user.id,
      });

      success('Movimiento registrado exitosamente');
      setShowMovimientoModal(false);
      setMovimientoData({ tipo_movimiento: '', cantidad: '', motivo: '' });
      cargarProductos();
    } catch (error) {
      console.error('Error registrando movimiento:', error);
      showError(error.response?.data?.error || 'Error al registrar movimiento');
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion || '',
      cantidad: producto.cantidad,
      unidad_medida: producto.unidad_medida,
      precio_unitario: producto.precio_unitario,
      stock_minimo: producto.stock_minimo,
      fecha_vencimiento: producto.fecha_vencimiento || '',
      proveedor: producto.proveedor || '',
      activo: producto.activo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    try {
      await inventarioAPI.delete(id);
      success('Producto eliminado exitosamente');
      cargarProductos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      showError('Error al eliminar el producto');
    }
  };

  const handleRegistrarMovimiento = (producto) => {
    setSelectedProducto(producto);
    setShowMovimientoModal(true);
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      categoria: '',
      descripcion: '',
      cantidad: 0,
      unidad_medida: '',
      precio_unitario: '',
      stock_minimo: 10,
      fecha_vencimiento: '',
      proveedor: '',
      activo: true,
    });
    setEditingId(null);
  };

  const handleNuevo = () => {
    resetForm();
    setShowModal(true);
  };

  const isFormValid = () => {
    return formData.codigo && formData.nombre && formData.categoria;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando inventario...</h2>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <div className="page-header">
        <h1>Gestión de Inventario</h1>
        <button className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="no-data">
          <p>No hay productos en el inventario.</p>
          <button className="btn btn-primary" onClick={handleNuevo}>
            Crear Primer Producto
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Precio Unit.</th>
                <th>Stock Mín.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className={producto.necesita_reposicion ? 'row-warning' : ''}
                >
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>
                    <span className={`badge badge-${producto.categoria}`}>
                      {producto.categoria}
                    </span>
                  </td>
                  <td>
                    <strong>{producto.cantidad}</strong>
                  </td>
                  <td>{producto.unidad_medida}</td>
                  <td>${parseFloat(producto.precio_unitario).toFixed(2)}</td>
                  <td>{producto.stock_minimo}</td>
                  <td>
                    {producto.necesita_reposicion ? (
                      <span className="badge badge-danger">Stock Bajo</span>
                    ) : (
                      <span className="badge badge-success">OK</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(producto)}
                      style={{ marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleRegistrarMovimiento(producto)}
                      style={{ marginRight: '5px' }}
                    >
                      Movimiento
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(producto.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear/Editar Producto */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content large-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Código <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    placeholder="Ej: MED-001"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Categoría <span className="required">*</span>
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="medicamento">Medicamento</option>
                    <option value="alimento">Alimento</option>
                    <option value="accesorio">Accesorio</option>
                    <option value="equipamiento">Equipamiento</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Descripción detallada del producto"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Unidad de Medida</label>
                  <input
                    type="text"
                    name="unidad_medida"
                    value={formData.unidad_medida}
                    onChange={handleChange}
                    placeholder="Ej: unidades, ml, kg"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio Unitario</label>
                  <input
                    type="number"
                    name="precio_unitario"
                    value={formData.precio_unitario}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Mínimo</label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={formData.stock_minimo}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Vencimiento</label>
                  <input
                    type="date"
                    name="fecha_vencimiento"
                    value={formData.fecha_vencimiento}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Proveedor</label>
                  <input
                    type="text"
                    name="proveedor"
                    value={formData.proveedor}
                    onChange={handleChange}
                    placeholder="Nombre del proveedor"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                  />
                  Producto Activo
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isFormValid()}
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Movimiento */}
      {showMovimientoModal && selectedProducto && (
        <div
          className="modal-overlay"
          onClick={() => setShowMovimientoModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Registrar Movimiento de Inventario</h2>
            <p>
              <strong>Producto:</strong> {selectedProducto.nombre}
            </p>
            <p>
              <strong>Stock Actual:</strong> {selectedProducto.cantidad}{' '}
              {selectedProducto.unidad_medida}
            </p>

            <form onSubmit={handleMovimientoSubmit}>
              <div className="form-group">
                <label>
                  Tipo de Movimiento <span className="required">*</span>
                </label>
                <select
                  name="tipo_movimiento"
                  value={movimientoData.tipo_movimiento}
                  onChange={handleMovimientoChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="entrada">Entrada (Aumentar Stock)</option>
                  <option value="salida">Salida (Disminuir Stock)</option>
                  <option value="ajuste">Ajuste (Establecer Cantidad)</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Cantidad <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={movimientoData.cantidad}
                  onChange={handleMovimientoChange}
                  required
                  min="1"
                  placeholder="Cantidad del movimiento"
                />
              </div>

              <div className="form-group">
                <label>
                  Motivo <span className="required">*</span>
                </label>
                <textarea
                  name="motivo"
                  value={movimientoData.motivo}
                  onChange={handleMovimientoChange}
                  required
                  rows="3"
                  placeholder="Motivo del movimiento"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Registrar Movimiento
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMovimientoModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .row-warning {
          background-color: #fef3c7;
        }

        .badge-medicamento {
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-alimento {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-accesorio {
          background: #f59e0b;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-equipamiento {
          background: #8b5cf6;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-success {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-danger {
          background: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .large-modal {
          min-width: 700px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .btn-info {
          background: #3b82f6;
          color: white;
        }

        .btn-info:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default GestionInventario;
