// Central API configuration for backend base URL and common paths
export const API_BASE_URL = 'http://localhost:8081';

export const API_PATHS = {
  eventos: '/api/eventos',
  organizacionesExternas: '/api/organizaciones-externas',
  instalaciones: '/api/instalaciones',
  auth: '/api/auth',
  usuarios: '/api/usuarios',
  estudiantes: '/api/estudiantes',
  docentes: '/api/docentes',
  secretarias: '/api/secretarias-academicas'
} as const;

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}


