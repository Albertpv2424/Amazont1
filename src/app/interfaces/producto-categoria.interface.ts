export interface Opinion {
  usuario: string;
  comentario: string;
  valoracion: number;
}

export interface ProductoCategoria {
  id_prod: number | string; // Changed from a function to a property that can be number or string
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
  stock: number;
  opiniones: Opinion[];
  precio_oferta: number | null;
  en_oferta: boolean;
}