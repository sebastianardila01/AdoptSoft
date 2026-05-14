// ============================================================
// CAPA DE SERVICIOS (Lógica de Negocio)
// Contiene todas las operaciones del dominio:
//   autenticación, mascotas, citas, historial, usuarios.
// Se comunica con la capa UI para renderizar resultados
// y con State para leer/escribir el estado global.
// No toca el DOM directamente salvo a través de ui.js.
// ============================================================

import {
  MOCK_USERS, ROLE_CONFIG, ROLE_SUBTITLES,
  SPECIES_EMOJI, RECORD_TYPE_META, ROLE_ICONS,
} from './config.js';

import {
  getRole, getSelectedRole, getSelectedSlot,
  setRole, setSelectedRole, setSelectedSlot, resetSession,
} from './state.js';

import {
  showToast, renderHeader, resetHeader,
  showFooterBar, hideFooterBar,
  renderNavTabs, hideNavTabs,
  highlightRoleButton, toggleLoginScreen,
  clearFields, initDateInputs, resetLoginForm,
  hideAllViews,
  prependPetItem, prependCitaItem,
  prependHistorialItem, prependUserItem,
  selectSlot, markSlotTaken,
} from './ui.js';

import { gotoTab } from './router.js';

// ── Autenticación ──────────────────────────────────────────

/**
 * Guarda el rol seleccionado en el selector de login.
 * @param {'dueno'|'vet'|'admin'} role
 */
export function selectRole(role) {
  setSelectedRole(role);
  highlightRoleButton(role);
}

/**
 * Intenta iniciar sesión con las credenciales del formulario.
 * Verifica el usuario mock y delega a enterDashboard.
 */
export function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value;

  if (!email || !pass) {
    showToast('Ingresa correo y contraseña', 'err');
    return;
  }

  let resolvedRole = getSelectedRole();

  if (!resolvedRole) {
    const user = MOCK_USERS[email];
    if (user && user.pass === pass) {
      resolvedRole = user.role;
    } else {
      showToast('Selecciona un rol para continuar', 'err');
      return;
    }
  }

  enterDashboard(resolvedRole);
}

/**
 * Inicializa la sesión para un rol dado.
 * Actualiza el estado, construye navegación y muestra el dashboard.
 * @param {'dueno'|'vet'|'admin'} role
 */
export function enterDashboard(role) {
  setRole(role);

  const cfg = ROLE_CONFIG[role];

  toggleLoginScreen(false);
  renderHeader(cfg, ROLE_SUBTITLES[role]);
  renderNavTabs(cfg.tabs, gotoTab);
  showFooterBar(cfg);
  initDateInputs();

  gotoTab(cfg.tabs[0].id);
  showToast('Bienvenido/a a VetSoft 🐾', 'ok');
}

/**
 * Cierra la sesión activa y vuelve a la pantalla de login.
 */
export function doLogout() {
  resetSession();
  hideAllViews();
  toggleLoginScreen(true);
  hideNavTabs();
  hideFooterBar();
  resetHeader();
  resetLoginForm();
  showToast('Sesión cerrada correctamente', 'inf');
}

// ── Recuperación de contraseña ─────────────────────────────

export function sendRecover() {
  const email = document.getElementById('rec-email').value.trim();
  if (!email) {
    showToast('Ingresa tu correo', 'err');
    return;
  }
  showToast(`📧 Enlace enviado a ${email}`, 'ok');
}

// ── Mascotas ───────────────────────────────────────────────

/**
 * Valida el formulario y registra una nueva mascota.
 */
export function addPet() {
  const name    = document.getElementById('p-nom').value.trim();
  const species = document.getElementById('p-esp').value;
  const breed   = document.getElementById('p-raza').value.trim();
  const age     = document.getElementById('p-edad').value.trim();
  const weight  = document.getElementById('p-peso').value;

  if (!name || !species) {
    showToast('Nombre y especie son requeridos', 'err');
    return;
  }

  const emoji   = SPECIES_EMOJI[species] ?? '🐾';
  const details = [breed, age, weight ? `${weight} kg` : '']
    .filter(Boolean)
    .join(' · ');

  prependPetItem({ emoji, name, details });
  clearFields(['p-nom', 'p-raza', 'p-edad', 'p-peso', 'p-esp']);
  showToast(`${name} registrado/a exitosamente 🐾`, 'ok');
}

// ── Citas ──────────────────────────────────────────────────

/**
 * Selecciona un turno horario en el grid de citas.
 * @param {HTMLElement} el
 */
export function handleSlotSelect(el) {
  selectSlot(el);
  setSelectedSlot(el);

  const dateInput = document.getElementById('c-fecha');
  if (!dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
}

/**
 * Valida y confirma una nueva cita.
 */
export function addCita() {
  const petName = document.getElementById('c-masc').value;
  const vet     = document.getElementById('c-vet').value;
  const type    = document.getElementById('c-tipo').value;
  const date    = document.getElementById('c-fecha').value;

  if (!petName || !date) {
    showToast('Mascota y fecha son requeridos', 'err');
    return;
  }

  const slotEl    = getSelectedSlot();
  const time      = slotEl ? slotEl.textContent : '—';
  const dateLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('es-CO', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '';

  prependCitaItem({
    petName,
    type:      type || 'Consulta',
    vet:       vet  || 'Veterinario',
    dateLabel,
    time,
  });

  if (slotEl) {
    markSlotTaken(slotEl);
    setSelectedSlot(null);
  }

  clearCita();
  showToast('Cita agendada exitosamente 📅', 'ok');
}

/** Limpia los campos del formulario de citas. */
export function clearCita() {
  clearFields(['c-masc', 'c-vet', 'c-tipo', 'c-motivo']);
}

// ── Historial Veterinario ──────────────────────────────────

/**
 * Valida y guarda un nuevo registro en el historial clínico.
 */
export function addHistorial() {
  const type = document.getElementById('vt-tipo').value;
  const desc = document.getElementById('vt-desc').value.trim();
  const med  = document.getElementById('vt-med').value.trim();
  const date = document.getElementById('vt-fecha').value;

  if (!desc) {
    showToast('Ingresa la descripción del registro', 'err');
    return;
  }

  const meta      = RECORD_TYPE_META[type] ?? { icon: '📋', cssClass: '' };
  const dateLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('es-CO', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '';

  prependHistorialItem({
    icon:      meta.icon,
    cssClass:  meta.cssClass,
    tipo:      type,
    desc,
    dateLabel,
    med,
  });

  clearFields(['vt-desc', 'vt-med']);
  showToast('Registro guardado en historial', 'ok');
}

// ── Usuarios (Admin) ───────────────────────────────────────

/**
 * Valida y crea un nuevo usuario desde el panel de administración.
 */
export function addUser() {
  const name  = document.getElementById('au-nom').value.trim();
  const email = document.getElementById('au-email').value.trim();
  const role  = document.getElementById('au-rol').value;

  if (!name || !email || !role) {
    showToast('Completa todos los campos requeridos', 'err');
    return;
  }

  prependUserItem({
    icon:  ROLE_ICONS[role] ?? '👤',
    name,
    email,
    role,
  });

  clearFields(['au-nom', 'au-email', 'au-tel', 'au-doc', 'au-rol']);
  showToast(`Usuario ${name} creado exitosamente`, 'ok');
}
