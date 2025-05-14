<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert categories correctly
        $categories = [
            [
                'nombre' => 'Tecnología',
                'imagen' => 'assets/tecnologia.png',
            ],
            [
                'nombre' => 'Deportes',
                'imagen' => 'assets/deportes.png',
            ],
            [
                'nombre' => 'Cocina',
                'imagen' => 'assets/cocina.png',
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categorias')->updateOrInsert(
                ['nombre' => $category['nombre']],
                [
                    'imagen' => $category['imagen'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Inserir productes (sense categoria_id)
        $productos = [
            [
                'id_prod' => 1,
                'nombre' => 'Balón de Fútbol Profesional',
                'descripcion' => 'Balón oficial de la Liga, diseño 2024',
                'precio' => 29.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 26.99,
                'imagen' => 'balon.png',
                'created_at' => now(),
                'updated_at' => now(),
                'categorias' => [2], // Deportes
            ],
            [
                'id_prod' => 2,
                'nombre' => 'Raqueta de Tenis Pro',
                'descripcion' => 'Raqueta profesional de grafito',
                'precio' => 189.99,
                'stock' => 25,
                'en_oferta' => false,
                'created_at' => now(),
                'updated_at' => now(),
                'categorias' => [2], // Deportes
            ],
            [
                'id_prod' => 3,
                'nombre' => 'Bicicleta de Montaña',
                'descripcion' => 'Bicicleta todo terreno con 21 velocidades',
                'precio' => 499.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 449.99,
                'created_at' => now(),
                'updated_at' => now(),
                'categorias' => [2], // Deportes
            ],
            [
                'id_prod' => 4,
                'nombre' => 'Set de Pesas',
                'descripcion' => 'Set completo de pesas ajustables',
                'precio' => 299.99,
                'stock' => 25,
                'en_oferta' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 5,
                'nombre' => 'Zapatillas Running',
                'descripcion' => 'Zapatillas profesionales para correr',
                'precio' => 89.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 76.49,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 6,
                'nombre' => 'Laptop Gaming Pro',
                'descripcion' => 'Laptop gaming con RTX 4080',
                'precio' => 1499.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 1199.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 7,
                'nombre' => 'Smartphone Ultimate',
                'descripcion' => 'Último modelo con cámara 108MP',
                'precio' => 899.99,
                'stock' => 25,
                'en_oferta' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 8,
                'nombre' => 'Auriculares Bluetooth',
                'descripcion' => 'Auriculares inalámbricos con cancelación de ruido',
                'precio' => 199.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 179.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 9,
                'nombre' => 'Smartwatch Pro',
                'descripcion' => 'Reloj inteligente con GPS y monitor cardíaco',
                'precio' => 299.99,
                'stock' => 25,
                'en_oferta' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 10,
                'nombre' => 'Tablet 4K',
                'descripcion' => 'Tablet de 12" con pantalla 4K',
                'precio' => 699.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 664.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 11,
                'nombre' => 'Robot de Cocina',
                'descripcion' => 'Robot de cocina multifunción',
                'precio' => 599.99,
                'stock' => 25,
                'en_oferta' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 12,
                'nombre' => 'Batidora Profesional',
                'descripcion' => 'Batidora de alta potencia para smoothies',
                'precio' => 129.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 109.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 13,
                'nombre' => 'Set de Cuchillos',
                'descripcion' => 'Set profesional de cuchillos de cocina',
                'precio' => 199.99,
                'stock' => 25,
                'en_oferta' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 14,
                'nombre' => 'Cafetera Espresso',
                'descripcion' => 'Cafetera automática con molinillo',
                'precio' => 399.99,
                'stock' => 25,
                'en_oferta' => true,
                'precio_oferta' => 359.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_prod' => 15,
                'nombre' => 'Horno Eléctrico',
                'descripcion' => 'Horno eléctrico de convección',
                'precio' => 299.99,
                'stock' => 25,
                'en_oferta' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            

        ];

        // Insert products into productos table
        foreach ($productos as $producto) {
            // Remove 'categorias' key before insert
            $productoData = $producto;
            unset($productoData['categorias']);
            DB::table('productos')->updateOrInsert(
                ['id_prod' => $productoData['id_prod']],
                $productoData
            );
        }
    
        // Now insert into categoria_producto pivot table
        foreach ($productos as $producto) {
            if (isset($producto['categorias'])) {
                foreach ($producto['categorias'] as $catId) {
                    DB::table('categoria_producto')->updateOrInsert(
                        [
                            'categoria_id' => $catId,
                            'producto_id' => $producto['id_prod']
                        ],
                        [
                            'created_at' => now(),
                            'updated_at' => now()
                        ]
                    );
                }
            }
        }
// Asignar categorías a los productos (pivot)
$pivot = [
    [
        'categoria_id' => 2,
        'producto_id' => 1,
    ],
    [
        'categoria_id' => 2,
        'producto_id' => 2,
    ],
    [
        'categoria_id' => 2,
        'producto_id' => 3,
    ],
    [
        'categoria_id' => 2,
        'producto_id' => 4,
    ],
    [
        'categoria_id' => 2,
        'producto_id' => 5,
    ],
    [
        'categoria_id' => 1,
        'producto_id' => 6,
    ],
    [
        'categoria_id' => 1,
        'producto_id' => 7,
    ],
    [
        'categoria_id' => 1,
        'producto_id' => 8,
    ],
    [
        'categoria_id' => 1,
        'producto_id' => 9,
    ],
    [
        'categoria_id' => 1,
        'producto_id' => 10,
    ],
    [
        'categoria_id' => 3,
        'producto_id' => 11,
    ],
    [
        'categoria_id' => 3,
        'producto_id' => 12,
    ],
    [
        'categoria_id' => 3,
        'producto_id' => 13,
    ],
    [
        'categoria_id' => 3,
        'producto_id' => 14,
    ],
    [
        'categoria_id' => 3,
        'producto_id' => 15,
    ],

];

foreach ($pivot as $rel) {
    DB::table('categoria_producto')->updateOrInsert(
        [
            'categoria_id' => $rel['categoria_id'],
            'producto_id' => $rel['producto_id']
        ],
        [
            'created_at' => now(),
            'updated_at' => now()
        ]
    );
}

    }
}