// src/app/interfaces/producto.interface.ts
export interface Producto {
  id?: number;  // Update these properties
  imagen: string;
  titulo?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  descuento?: string;
  categoria?: string;
  popularidad?: number;
  esNuevo?: boolean;
  envioGratis?: boolean;
  fechaLanzamiento?: Date;
  stock: number;
}