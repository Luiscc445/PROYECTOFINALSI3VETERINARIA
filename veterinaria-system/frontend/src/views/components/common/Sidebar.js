/**
 * Sidebar - Menú lateral de navegación
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../styles/Sidebar.css';

const Sidebar = ({ links }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          {links.map((link, index) => (
            <li key={index} className="sidebar-item">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
                end={link.end}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-text">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
