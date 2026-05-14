// ============================================================
// CAPA DE CONFIGURACIÓN
// Contiene: constantes, datos mock, definición de roles y vistas
// No depende de ninguna otra capa
// ============================================================

export const TOAST_DURATION_MS = 3200;

// Credenciales demo (en producción vendría de un backend)
export const MOCK_USERS = {
  'dueno@demo.com': { pass: '123', role: 'dueno' },
  'vet@demo.com':   { pass: '123', role: 'vet'   },
  'admin@demo.com': { pass: '123', role: 'admin'  },
};

// Configuración de cada rol: etiqueta, ícono y tabs disponibles
export const ROLE_CONFIG = {
  dueno: {
    label: '👤 Dueño',
    icon:  '🐶',
    tabs: [
      { id: 'v-dueno-dash',      label: '🏠 Inicio'       },
      { id: 'v-dueno-mascotas',  label: '🐾 Mis Mascotas' },
      { id: 'v-dueno-citas',     label: '📅 Citas'        },
      { id: 'v-dueno-historial', label: '📋 Historial'    },
    ],
  },
  vet: {
    label: '🩺 Veterinario',
    icon:  '🩺',
    tabs: [
      { id: 'v-vet-dash',      label: '🏠 Inicio'            },
      { id: 'v-vet-agenda',    label: '📆 Mi Agenda'         },
      { id: 'v-vet-pacientes', label: '🐾 Pacientes'         },
      { id: 'v-vet-historial', label: '📋 Registrar Consulta'},
    ],
  },
  admin: {
    label: '🛡️ Administrador',
    icon:  '🛡️',
    tabs: [
      { id: 'v-admin-dash',     label: '🏠 Inicio'       },
      { id: 'v-admin-usuarios', label: '👥 Usuarios'     },
      { id: 'v-admin-vets',     label: '🩺 Veterinarios' },
    ],
  },
};

export const ROLE_SUBTITLES = {
  dueno: 'Gestión de Mascotas',
  vet:   'Panel Veterinario',
  admin: 'Panel de Administración',
};

// Mapeo especie → emoji
export const SPECIES_EMOJI = {
  '🐕 Perro': '🐕',
  '🐈 Gato':  '🐈',
  '🐇 Conejo':'🐇',
  '🐦 Ave':   '🐦',
  'Otro':     '🐾',
};

// Iconos y clases CSS para tipos de historial veterinario
export const RECORD_TYPE_META = {
  Diagnóstico: { icon: '🔬', cssClass: 'diag' },
  Vacuna:      { icon: '💉', cssClass: 'vac'  },
  Tratamiento: { icon: '💊', cssClass: ''     },
  Control:     { icon: '🩺', cssClass: ''     },
};

// Iconos para roles de usuario (panel admin)
export const ROLE_ICONS = {
  dueño:        '👤',
  veterinario:  '🩺',
  admin:        '🛡️',
};
