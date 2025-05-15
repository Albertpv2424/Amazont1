export interface Opinion {
  usuario: string;
  comentario: string;
  valoracion: number;
}

export interface ProductoCategoria {
  id_prod(arg0: string, id_prod: any): unknown;
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
  stock: number; // Changed from optional to required
  opiniones: Opinion[];
  precio_oferta: number | null;
  en_oferta: boolean;
}