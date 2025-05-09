export interface Usuario {
  nombre: string;
  email: string;
  password: string;
  tipoUsuario: 'Cliente' | 'Vendedor';
  aceptaTerminos: boolean;
  telefono?: string;
  ciudad?: string;
  pais?: string;
}