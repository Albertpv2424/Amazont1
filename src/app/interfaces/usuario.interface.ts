export interface Usuario {
  nombre: string;
  email: string;
  contraseña: string;
  contraseña_confirmation: string;
  rol: 'Cliente' | 'Vendedor';
  aceptaTerminos: boolean;
  telefono?: string;
  ciudad?: string;
  pais?: string;
}