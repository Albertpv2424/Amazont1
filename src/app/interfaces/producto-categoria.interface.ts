export interface ProductoCategoria {
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
}
