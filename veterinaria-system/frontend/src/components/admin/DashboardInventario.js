/**
 * DashboardInventario - Dashboard visual de inventario con métricas
 */
import React, { useState, useEffect } from 'react';
import { inventarioAPI } from '../../services/api';
import '../../styles/Dashboard.css';

const DashboardInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    bajoStock: 0,
    valorTotal: 0,
    categorias: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const response = await inventarioAPI.getAll();
      const items = response.data.results || response.data;
      setInventario(items);
      calcularEstadisticas(items);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (items) => {
    const stats = {
      total: items.length,
      bajoStock: 0,
      valorTotal: 0,
      categorias: {}
    };

    items.forEach(item => {
      // Contar bajo stock
      if (item.cantidad <= item.stock_minimo) {
        stats.bajoStock++;
      }

      // Valor total
      stats.valorTotal += item.cantidad * parseFloat(item.precio_unitario);

      // Por categoría
      if (!stats.categorias[item.categoria]) {
        stats.categorias[item.categoria] = {
          count: 0,
          stock: 0,
          valor: 0
        };
      }
      stats.categorias[item.categoria].count++;
      stats.categorias[item.categoria].stock += item.cantidad;
      stats.categorias[item.categoria].valor += item.cantidad * parseFloat(item.precio_unitario);
    });

    setStats(stats);
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  const categoriaColors = {
    medicamento: '#3498db',
    alimento: '#27ae60',
    accesorio: '#f39c12',
    equipamiento: '#9b59b6'
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Inventario</h1>

      {/* Tarjetas de resumen */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Productos</div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.bajoStock}</div>
            <div className="stat-label">Bajo Stock</div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">${stats.valorTotal.toFixed(2)}</div>
            <div className="stat-label">Valor Total</div>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{Object.keys(stats.categorias).length}</div>
            <div className="stat-label">Categorías</div>
          </div>
        </div>
      </div>

      {/* Productos con stock bajo */}
      <div className="dashboard-section">
        <h2>⚠️ Productos con Stock Bajo</h2>
        <div className="low-stock-grid">
          {inventario
            .filter(item => item.cantidad <= item.stock_minimo)
            .map(item => (
              <div key={item.id} className="low-stock-card">
                <div className="low-stock-header">
                  <span className={`badge badge-${item.categoria}`}>{item.categoria}</span>
                  <span className="low-stock-code">{item.codigo}</span>
                </div>
                <div className="low-stock-name">{item.nombre}</div>
                <div className="low-stock-meters">
                  <div className="stock-meter">
                    <div className="meter-label">
                      <span>Stock Actual</span>
                      <span className="meter-value danger">{item.cantidad}</span>
                    </div>
                    <div className="meter-bar">
                      <div
                        className="meter-fill danger"
                        style={{ width: `${(item.cantidad / item.stock_minimo) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="stock-meter">
                    <div className="meter-label">
                      <span>Stock Mínimo</span>
                      <span className="meter-value">{item.stock_minimo}</span>
                    </div>
                  </div>
                </div>
                <div className="low-stock-action">
                  <button className="btn-small btn-primary">Reabastecer</button>
                </div>
              </div>
            ))}
          {inventario.filter(item => item.cantidad <= item.stock_minimo).length === 0 && (
            <div className="empty-state">
              <span>✓ Todos los productos tienen stock adecuado</span>
            </div>
          )}
        </div>
      </div>

      {/* Stock por categoría */}
      <div className="dashboard-section">
        <h2>📊 Stock por Categoría</h2>
        <div className="category-grid">
          {Object.entries(stats.categorias).map(([categoria, data]) => (
            <div key={categoria} className="category-card">
              <div className="category-header" style={{ backgroundColor: categoriaColors[categoria] }}>
                <div className="category-icon">
                  {categoria === 'medicamento' && '💊'}
                  {categoria === 'alimento' && '🍖'}
                  {categoria === 'accesorio' && '🎀'}
                  {categoria === 'equipamiento' && '🔧'}
                </div>
                <div className="category-name">{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</div>
              </div>
              <div className="category-stats">
                <div className="category-stat">
                  <div className="stat-number">{data.count}</div>
                  <div className="stat-text">Productos</div>
                </div>
                <div className="category-stat">
                  <div className="stat-number">{data.stock}</div>
                  <div className="stat-text">Unidades</div>
                </div>
                <div className="category-stat">
                  <div className="stat-number">${data.valor.toFixed(2)}</div>
                  <div className="stat-text">Valor</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 productos por stock */}
      <div className="dashboard-section">
        <h2>🏆 Top 10 Productos por Stock</h2>
        <div className="top-products">
          {inventario
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 10)
            .map((item, index) => (
              <div key={item.id} className="top-product-item">
                <div className="top-product-rank">#{index + 1}</div>
                <div className="top-product-info">
                  <div className="top-product-name">{item.nombre}</div>
                  <span className={`badge badge-${item.categoria}`}>{item.categoria}</span>
                </div>
                <div className="top-product-stock">
                  <div className="stock-display">
                    <span className="stock-number">{item.cantidad}</span>
                    <span className="stock-unit">{item.unidad_medida}</span>
                  </div>
                  <div className="stock-bar-container">
                    <div
                      className="stock-bar-fill"
                      style={{
                        width: `${(item.cantidad / Math.max(...inventario.map(i => i.cantidad))) * 100}%`,
                        backgroundColor: categoriaColors[item.categoria]
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardInventario;
