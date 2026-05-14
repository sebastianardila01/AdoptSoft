// ============================================================
// PUNTO DE ENTRADA (app.js)
// Inicializa la aplicación: registra event listeners globales
// y conecta los elementos del DOM con los servicios.
// Es la única capa que "sabe" sobre el HTML completo.
// ============================================================

import { initModalBackdropClose, showToast, openModal, closeModal } from './ui.js';
import { gotoTab }        from './router.js';
import {
  selectRole, doLogin, doLogout, sendRecover,
  addPet, handleSlotSelect,
  addCita, clearCita,
  addHistorial,
  addUser,
} from './services.js';

// ── Exponer al HTML lo mínimo necesario ────────────────────
// Los onclick en el markup necesitan funciones globales.
// Centralizar aquí evita pollution del scope global.

window.selRole     = selectRole;
window.doLogin     = doLogin;
window.doLogout    = doLogout;
window.gotoTab     = gotoTab;
window.showToast   = showToast;
window.openModal   = openModal;
window.closeModal  = closeModal;
window.sendRecover = sendRecover;
window.addPet      = addPet;
window.selSlot     = handleSlotSelect;
window.addCita     = addCita;
window.clearCita   = clearCita;
window.addHistorial = addHistorial;
window.addUser     = addUser;

// ── Inicialización al cargar el DOM ────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Cierre de modales al hacer clic en el backdrop
  initModalBackdropClose();

  // Fecha mínima en el campo de citas del login (sin sesión activa)
  const today = new Date().toISOString().split('T')[0];
  const citaFecha = document.getElementById('c-fecha');
  if (citaFecha) citaFecha.min = today;

  console.info('VetSoft™ inicializado correctamente.');
});
