export interface Pedido {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  productos?: any[]; // Puedes definir una interfaz más específica para los productos
  direccionEnvio?: string;
  metodoPago?: string;
}