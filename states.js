// ============================================================
// CAPA DE ESTADO (State)
// Fuente única de verdad para el estado de la aplicación.
// Solo expone getters y mutadores controlados; nunca toca el DOM.
// ============================================================

const _state = {
  currentRole: null,       // 'dueno' | 'vet' | 'admin' | null
  selectedRole: null,      // rol elegido en el selector de login
  selectedSlotEl: null,    // elemento DOM del turno seleccionado
  toastTimer: null,        // referencia al setTimeout del toast
};

// ── Getters ────────────────────────────────────────────────

export const getRole         = () => _state.currentRole;
export const getSelectedRole = () => _state.selectedRole;
export const getSelectedSlot = () => _state.selectedSlotEl;
export const getToastTimer   = () => _state.toastTimer;

// ── Mutadores ──────────────────────────────────────────────

export function setRole(role) {
  _state.currentRole = role;
}

export function setSelectedRole(role) {
  _state.selectedRole = role;
}

export function setSelectedSlot(el) {
  _state.selectedSlotEl = el;
}

export function setToastTimer(timer) {
  _state.toastTimer = timer;
}

export function resetSession() {
  _state.currentRole    = null;
  _state.selectedRole   = null;
  _state.selectedSlotEl = null;
}
