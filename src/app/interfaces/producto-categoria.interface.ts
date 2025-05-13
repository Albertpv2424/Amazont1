export interface Opinion {
  usuario: string;
  comentario: string;
  valoracion: number;
}

export interface ProductoCategoria {
  oferta: unknown;
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  popularidad: number;
  esNuevo: boolean;
  envioGratis: boolean;
  fechaLanzamiento: Date;
  descuento?: string;
  stock?: number; // Add stock property
  opiniones: Opinion[]; // Afegir la propietat 'opiniones'
  precio_oferta: number | null;
  en_oferta: boolean;
}