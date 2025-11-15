/**
 * Views - Arquitectura MVC
 * Exporta todos los componentes y páginas
 */
// Common components
export { default as Navbar } from './common/Navbar';
export { default as Sidebar } from './common/Sidebar';
export { default as ProtectedRoute } from './common/ProtectedRoute';

// Pages
export { default as Login } from './pages/Login';
export { default as AdminDashboard } from './pages/AdminDashboard';
export { default as TutorDashboard } from './pages/TutorDashboard';
export { default as VeterinarioDashboard } from './pages/VeterinarioDashboard';

// Admin Views
export { default as GestionUsuarios } from './admin/GestionUsuarios';
export { default as GestionMascotas } from './admin/GestionMascotas';
export { default as GestionCitasAdmin } from './admin/GestionCitas';
export { default as GestionInventario } from './admin/GestionInventario';

// Tutor Views
export { default as MisMascotas } from './tutor/MisMascotas';
export { default as MisCitas } from './tutor/MisCitas';
export { default as HistorialMedico } from './tutor/HistorialMedico';
export { default as SolicitarCita } from './tutor/SolicitarCita';

// Veterinario Views
export { default as VetHome } from './veterinario/VetHome';
export { default as GestionCitas } from './veterinario/GestionCitas';
export { default as CrearHistorial } from './veterinario/CrearHistorial';
