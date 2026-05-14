// ============================================================
// CAPA DE UI (Presentación)
// Responsabilidad única: manipular el DOM.
// No contiene lógica de negocio ni accede al estado directamente.
// Recibe datos ya procesados y los renderiza.
// ============================================================

import { TOAST_DURATION_MS } from './config.js';
import { getToastTimer, setToastTimer } from './state.js';

// ── Toast ──────────────────────────────────────────────────

/**
 * Muestra una notificación temporal.
 * @param {string} message
 * @param {'ok'|'err'|'inf'} type
 */
export function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');

  clearTimeout(getToastTimer());
  setToastTimer(
    setTimeout(() => toast.classList.remove('show'), TOAST_DURATION_MS)
  );
}

// ── Modales ────────────────────────────────────────────────

export function openModal(id) {
  document.getElementById(`mo-${id}`).classList.add('open');
}

export function closeModal(id) {
  document.getElementById(`mo-${id}`).classList.remove('open');
}

/** Cierra un modal al hacer clic fuera de él. */
export function initModalBackdropClose() {
  document.querySelectorAll('.mo').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el) el.classList.remove('open');
    });
  });
}

// ── Pantalla de Login ──────────────────────────────────────

/** Marca visualmente el rol seleccionado en los botones de login. */
export function highlightRoleButton(role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById(`rb-${role}`).classList.add('sel');
}

/** Muestra/oculta la pantalla de login. */
export function toggleLoginScreen(visible) {
  document.getElementById('screen-login').style.display = visible ? 'block' : 'none';
}

// ── Cabecera / Footer ──────────────────────────────────────

/**
 * Actualiza la cabecera con los datos del rol activo.
 * @param {{ label: string, icon: string }} roleConfig
 * @param {string} subtitle
 */
export function renderHeader(roleConfig, subtitle) {
  document.getElementById('hdrSub').textContent = subtitle;

  const tag = document.getElementById('roleTag');
  tag.textContent = roleConfig.label;
  tag.classList.add('show');
}

/** Restaura la cabecera al estado inicial. */
export function resetHeader() {
  document.getElementById('hdrSub').textContent = 'Plataforma de Gestión Veterinaria';
  document.getElementById('roleTag').classList.remove('show');
}

/**
 * Muestra la barra inferior con el rol del usuario.
 * @param {{ label: string, icon: string }} roleConfig
 */
export function showFooterBar(roleConfig) {
  document.getElementById('fbar').style.display = 'flex';
  document.getElementById('fav').textContent = roleConfig.icon;
  document.getElementById('froleName').textContent = roleConfig.label;
}

export function hideFooterBar() {
  document.getElementById('fbar').style.display = 'none';
}

// ── Tabs de navegación ─────────────────────────────────────

/**
 * Construye los tabs de navegación del rol activo.
 * @param {Array<{id: string, label: string}>} tabs
 * @param {function(string): void} onTabClick  callback del router
 */
export function renderNavTabs(tabs, onTabClick) {
  const nav = document.getElementById('navTabs');
  nav.style.display = 'flex';
  nav.innerHTML = '';

  tabs.forEach((tab, i) => {
    const el = document.createElement('div');
    el.className = `nav-tab${i === 0 ? ' active' : ''}`;
    el.textContent = tab.label;
    el.addEventListener('click', () => onTabClick(tab.id));
    nav.appendChild(el);
  });
}

export function hideNavTabs() {
  const nav = document.getElementById('navTabs');
  nav.style.display = 'none';
  nav.innerHTML = '';
}

/**
 * Marca como activo el tab correspondiente a una vista.
 * @param {string} viewId
 * @param {Array<{id: string, label: string}>} tabs
 */
export function setActiveTab(viewId, tabs) {
  const navTabs = document.querySelectorAll('.nav-tab');
  tabs.forEach((tab, i) => {
    if (navTabs[i]) {
      navTabs[i].classList.toggle('active', tab.id === viewId);
    }
  });
}

// ── Vistas ─────────────────────────────────────────────────

/** Oculta todas las vistas y muestra la indicada. */
export function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById(viewId);
  if (el) el.classList.add('active');
}

export function hideAllViews() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
}

// ── Formularios ────────────────────────────────────────────

/** Limpia el valor de una lista de campos por ID. */
export function clearFields(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT') el.value = '';
    else el.value = '';
  });
}

/** Establece la fecha mínima en todos los inputs de tipo date. */
export function initDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type=date]').forEach(el => {
    if (!el.value) el.value = today;
    el.min = today;
  });
}

// ── Renderizadores de listas ────────────────────────────────

/**
 * Crea y antepone una tarjeta de mascota en la lista.
 * @param {{ emoji: string, name: string, details: string }} data
 */
export function prependPetItem({ emoji, name, details }) {
  const item = document.createElement('div');
  item.className = 'iitem';
  item.innerHTML = `
    <div class="iico">${emoji}</div>
    <div class="iinfo">
      <strong>${name}</strong>
      <span>${details}</span>
    </div>
    <span class="ibadge green">Activo</span>`;
  document.getElementById('petList').prepend(item);
}

/**
 * Crea y antepone una tarjeta de cita en la lista.
 * @param {{ petName: string, type: string, vet: string, dateLabel: string, time: string }} data
 */
export function prependCitaItem({ petName, type, vet, dateLabel, time }) {
  const item = document.createElement('div');
  item.className = 'iitem';
  item.innerHTML = `
    <div class="iico">📅</div>
    <div class="iinfo">
      <strong>${petName} — ${type}</strong>
      <span>${vet} · ${dateLabel} · ${time}</span>
    </div>
    <span class="ibadge">Pendiente</span>`;
  document.getElementById('citaList').prepend(item);
}

/**
 * Crea y antepone un ítem de historial veterinario.
 * @param {{ icon: string, cssClass: string, tipo: string, desc: string, dateLabel: string, med: string }} data
 */
export function prependHistorialItem({ icon, cssClass, tipo, desc, dateLabel, med }) {
  const item = document.createElement('div');
  item.className = `hitem ${cssClass}`;
  item.innerHTML = `
    <div class="ht">${icon} ${tipo}: ${desc}</div>
    <div class="hd">${dateLabel}${med ? ' · ' + med : ''}</div>`;
  document.getElementById('hlist').prepend(item);
}

/**
 * Crea y antepone un ítem de usuario en el panel admin.
 * @param {{ icon: string, name: string, email: string, role: string }} data
 */
export function prependUserItem({ icon, name, email, role }) {
  const item = document.createElement('div');
  item.className = 'iitem';
  item.innerHTML = `
    <div class="iico">${icon}</div>
    <div class="iinfo">
      <strong>${name}</strong>
      <span>${email}</span>
    </div>
    <span class="ibadge blue">${role}</span>`;
  document.getElementById('userList').prepend(item);
}

// ── Turnos (slots) ─────────────────────────────────────────

/** Quita la selección de todos los slots y marca el indicado. */
export function selectSlot(el) {
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

/** Marca un slot como ocupado y elimina su interactividad. */
export function markSlotTaken(el) {
  el.classList.add('taken');
  el.classList.remove('selected');
  el.onclick = null;
}

// ── Reset completo de login ─────────────────────────────────

export function resetLoginForm() {
  document.getElementById('l-email').value = '';
  document.getElementById('l-pass').value  = '';
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('sel'));
}
