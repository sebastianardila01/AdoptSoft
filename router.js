// ============================================================
// CAPA DE ROUTER (Navegación)
// Responsabilidad: gestionar qué vista está activa.
// Coordina estado y UI; no contiene lógica de negocio.
// ============================================================

import { ROLE_CONFIG } from './config.js';
import { getRole }     from './state.js';
import { showView, setActiveTab } from './ui.js';

/**
 * Navega a la vista indicada dentro del rol actual.
 * @param {string} viewId - ID del elemento <div class="view">
 */
export function gotoTab(viewId) {
  const role = getRole();
  if (!role) return;

  showView(viewId);
  setActiveTab(viewId, ROLE_CONFIG[role].tabs);
}
