-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2025 a las 12:30:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `amazont`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado` varchar(255) NOT NULL DEFAULT 'actiu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`id`, `user_id`, `total`, `estado`, `created_at`, `updated_at`) VALUES
(1, 1, 0.00, 'finalizado', '2025-05-14 18:20:46', '2025-05-16 07:19:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_productos`
--

CREATE TABLE `carrito_productos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `carrito_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_cat` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_cat`, `nombre`, `descripcion`, `imagen`, `created_at`, `updated_at`) VALUES
(1, 'Tecnología', NULL, 'assets/tecnologia.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(2, 'Deportes', NULL, 'assets/deportes.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(3, 'Cocina', NULL, 'assets/cocina.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_producto`
--

CREATE TABLE `categoria_producto` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categoria_producto`
--

INSERT INTO `categoria_producto` (`id`, `categoria_id`, `producto_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(2, 2, 2, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(3, 2, 3, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(6, 2, 4, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(7, 2, 5, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(8, 1, 6, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(9, 1, 7, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(10, 1, 8, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(11, 1, 9, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(12, 1, 10, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(13, 3, 11, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(14, 3, 12, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(15, 3, 13, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(16, 3, 14, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(17, 3, 15, '2025-05-14 18:19:55', '2025-05-14 18:19:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO `detalles_pedido` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 4, 26.99, '2025-05-15 09:46:54', '2025-05-15 09:46:54'),
(2, 1, 3, 2, 449.99, '2025-05-15 09:46:54', '2025-05-15 09:46:54'),
(3, 1, 5, 2, 76.49, '2025-05-15 09:46:54', '2025-05-15 09:46:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `numero_tarjeta` varchar(255) DEFAULT NULL,
  `nombre_titular` varchar(255) DEFAULT NULL,
  `cvv` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_expiracion` varchar(255) DEFAULT NULL,
  `email_paypal` varchar(255) DEFAULT NULL,
  `iban` varchar(255) DEFAULT NULL,
  `nombre_banco` varchar(255) DEFAULT NULL,
  `es_predeterminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id`, `user_id`, `tipo`, `numero_tarjeta`, `nombre_titular`, `cvv`, `fecha_expiracion`, `email_paypal`, `iban`, `nombre_banco`, `es_predeterminado`, `created_at`, `updated_at`) VALUES
(1, 1, 'paypal', NULL, NULL, NULL, NULL, 'albertpv24@gmail.com', NULL, NULL, 1, '2025-05-15 09:46:28', '2025-05-15 09:46:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(3, '2025_03_177_create_add_role_to_users_table', 1),
(4, '2025_03_17_184905_create_categories_table', 1),
(5, '2025_03_17_184905_create_orders_table', 1),
(6, '2025_03_17_184905_create_products_table', 1),
(7, '2025_03_17_184906_create_order_items_table', 1),
(8, '2025_03_17_184907_create_payment_methods_table', 1),
(9, '2025_03_18_000001_add_image_to_categories_table', 1),
(10, '2025_03_18_000002_create_reviews_table', 1),
(11, '2025_03_18_000003_create_ratings_table', 1),
(12, '2025_04_01_000001_add_imagen_to_productos_table', 1),
(13, '2025_04_01_create_carts_table', 1),
(14, '2025_04_02_000001_add_estado_to_carritos_table', 1),
(15, '2025_04_10_000001_add_fields_to_payment_methods_table', 1),
(16, '2025_04_15_000001_add_shipping_address_to_users_table', 1),
(17, '2025_05_12_041426_remove_categoria_id_from_productos_table', 1),
(18, '2025_05_12_050000_create_categoria_producto_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opiniones`
--

CREATE TABLE `opiniones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `comentario` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente',
  `metodo_pago_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `user_id`, `total`, `estado`, `metodo_pago_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1160.92, 'pendiente', 1, '2025-05-15 09:46:54', '2025-05-15 09:46:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '8fea239ec4bd86c7e8956195d8a127650df7942a0e808057fc2695b517c074ef', '[\"*\"]', NULL, NULL, '2025-05-14 18:20:36', '2025-05-14 18:20:36'),
(3, 'App\\Models\\User', 1, 'auth_token', 'c580380d0c3fcee8daa7f0b86506fb5639e9c68685a54bd91d90dde7ee453d38', '[\"*\"]', '2025-05-14 20:57:56', NULL, '2025-05-14 18:54:20', '2025-05-14 20:57:56'),
(4, 'App\\Models\\User', 1, 'auth_token', 'adb26b108a6e29f0a5589e671e75da5ec824005b6e9b52b235eee00152387168', '[\"*\"]', '2025-05-15 05:45:40', NULL, '2025-05-14 20:29:01', '2025-05-15 05:45:40'),
(6, 'App\\Models\\User', 2, 'auth_token', 'd68aed05d91233ae826d6a78eaa9df0f12fad5f694df020ee25d40034109f47e', '[\"*\"]', NULL, NULL, '2025-05-15 07:41:02', '2025-05-15 07:41:02'),
(7, 'App\\Models\\User', 1, 'auth_token', '59b4f94085857dc34a39902fe5b09ef48aeeb024fb858d8b7843ac54dcb26783', '[\"*\"]', NULL, NULL, '2025-05-15 07:49:01', '2025-05-15 07:49:01'),
(8, 'App\\Models\\User', 1, 'auth_token', '4906237924f169d22ad461bcb5fca682c9cfa91862713201e06f6eaa697c5d76', '[\"*\"]', NULL, NULL, '2025-05-15 07:49:14', '2025-05-15 07:49:14'),
(9, 'App\\Models\\User', 1, 'auth_token', 'bc685e86862bb3d5263afb13b2096de235c3c7828baa42b701e704dada55b6c1', '[\"*\"]', NULL, NULL, '2025-05-15 07:52:12', '2025-05-15 07:52:12'),
(10, 'App\\Models\\User', 1, 'auth_token', '1ccc4ddcb44227f0595fd32b35bfe478f8e7f2761b14a8831a2db1f533ffc1f7', '[\"*\"]', NULL, NULL, '2025-05-15 07:52:12', '2025-05-15 07:52:12'),
(22, 'App\\Models\\User', 1, 'auth_token', '25a55fb3aa4d9bf119437e028dc3b51d45dfe883828d4ab8c62add4ade816ef5', '[\"*\"]', NULL, NULL, '2025-05-15 08:21:00', '2025-05-15 08:21:00'),
(29, 'App\\Models\\User', 1, 'auth_token', '30bab4e42c2ea496164c546160f72cd8a8c9120152b1d059fb693543df72a67a', '[\"*\"]', NULL, NULL, '2025-05-15 08:53:36', '2025-05-15 08:53:36'),
(38, 'App\\Models\\User', 3, 'auth_token', 'da1f7d76a195f3a56a6c0a78f0a924b96c3c0e403330c552aeeac56cc245b1dc', '[\"*\"]', NULL, NULL, '2025-05-15 10:06:10', '2025-05-15 10:06:10'),
(39, 'App\\Models\\User', 1, 'auth_token', '2814f7ab5252a40980337d4b5c4a3378e2cc7287280a3b3ae580b8aec30ad35b', '[\"*\"]', NULL, NULL, '2025-05-15 10:07:15', '2025-05-15 10:07:15'),
(40, 'App\\Models\\User', 1, 'auth_token', '9be0cc843e6c4af145c051ea7f0896e67861c4a4564e5d228a7ce4e15a83b2ff', '[\"*\"]', NULL, NULL, '2025-05-15 10:08:24', '2025-05-15 10:08:24'),
(44, 'App\\Models\\User', 1, 'auth_token', 'adba8a26bb37d4d04cda5f60c8fec77f6f19912a00493dad53e0a34e3e1b99dc', '[\"*\"]', NULL, NULL, '2025-05-15 10:13:50', '2025-05-15 10:13:50'),
(48, 'App\\Models\\User', 1, 'auth_token', '741494503c3ef12f35bcea44cfbf82c36a5b91761de43430afa8f45fd8be20e3', '[\"*\"]', NULL, NULL, '2025-05-15 10:23:48', '2025-05-15 10:23:48'),
(51, 'App\\Models\\User', 1, 'auth_token', '0d44937d83b2b5d8ad05c82049d8f11079b39f6cf7e48e987d6f7d4bea08e136', '[\"*\"]', NULL, NULL, '2025-05-15 10:25:32', '2025-05-15 10:25:32'),
(53, 'App\\Models\\User', 1, 'auth_token', '07da4c3b3cc36a0eddd7e8ce44c12286e78b6bdb6026df834e5adf9fbe0af249', '[\"*\"]', NULL, NULL, '2025-05-15 10:28:08', '2025-05-15 10:28:08'),
(56, 'App\\Models\\User', 1, 'auth_token', '5d4dd5ed7521cf8318b3ef2a6af7f6bcab24fbb570787c2ab2c8aedd9545517a', '[\"*\"]', '2025-05-15 10:36:18', NULL, '2025-05-15 10:36:14', '2025-05-15 10:36:18'),
(63, 'App\\Models\\User', 1, 'auth_token', '8e7596e73bb5992f6ddad1e570f73c4e42f903a1f7dc1f583f51d37d3828f36d', '[\"*\"]', '2025-05-15 10:47:03', NULL, '2025-05-15 10:47:00', '2025-05-15 10:47:03'),
(64, 'App\\Models\\User', 1, 'auth_token', '73c039e4d761afbd9b697d0988a5b6d26355d8ddd16ecc90b9c15c025afd316b', '[\"*\"]', '2025-05-15 10:51:37', NULL, '2025-05-15 10:51:15', '2025-05-15 10:51:37'),
(68, 'App\\Models\\User', 1, 'auth_token', '0049281e40e5b49b3619961dd30bd052d2af33f7bc828590a00338c00b72ce07', '[\"*\"]', '2025-05-15 11:30:07', NULL, '2025-05-15 11:30:02', '2025-05-15 11:30:07'),
(73, 'App\\Models\\User', 3, 'auth_token', 'abdc3c1513e8c7fb3a02a3852b94038d0cacbf74e6505e3d214d5447279da6ae', '[\"*\"]', '2025-05-16 08:25:21', NULL, '2025-05-16 08:00:36', '2025-05-16 08:25:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_prod` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `en_oferta` tinyint(1) NOT NULL DEFAULT 0,
  `precio_oferta` decimal(10,2) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_prod`, `nombre`, `descripcion`, `precio`, `stock`, `en_oferta`, `precio_oferta`, `imagen`, `created_at`, `updated_at`) VALUES
(1, 'Balón de Fútbol Profesional', 'Balón oficial de la Liga, diseño 2024', 29.99, 24, 1, 26.99, 'balon.png', '2025-05-14 18:19:55', '2025-05-16 07:39:32'),
(2, 'Raqueta de Tenis Pro', 'Raqueta profesional de grafito', 189.99, 25, 0, NULL, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(3, 'Bicicleta de Montaña', 'Bicicleta todo terreno con 21 velocidades', 499.99, 23, 1, 449.99, NULL, '2025-05-14 18:19:55', '2025-05-15 09:46:54'),
(4, 'Set de Pesas', 'Set completo de pesas ajustables', 299.99, 25, 0, NULL, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(5, 'Zapatillas Running', 'Zapatillas profesionales para correr', 89.99, 23, 1, 76.49, NULL, '2025-05-14 18:19:55', '2025-05-15 09:46:54'),
(6, 'Laptop Gaming Pro', 'Laptop gaming con RTX 4080', 1499.99, 25, 1, 1199.99, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(7, 'Smartphone Ultimate', 'Último modelo con cámara 108MP', 899.99, 25, 0, NULL, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(8, 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 199.99, 25, 1, 179.99, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(9, 'Smartwatch Pro', 'Reloj inteligente con GPS y monitor cardíaco', 299.99, 25, 0, NULL, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(10, 'Tablet 4K', 'Tablet de 12\" con pantalla 4K', 699.99, 25, 1, 664.99, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(11, 'Robot de Cocina', 'Robot de cocina multifunción', 599.99, 25, 0, NULL, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(12, 'Batidora Profesional', 'Batidora de alta potencia para smoothies', 129.99, 25, 1, 109.99, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(13, 'Set de Cuchillos', 'Set profesional de cuchillos de cocina', 199.99, 25, 0, NULL, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(14, 'Cafetera Espresso', 'Cafetera automática con molinillo', 399.99, 25, 1, 359.99, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(15, 'Horno Eléctrico', 'Horno eléctrico de convección', 299.99, 25, 0, NULL, NULL, '2025-05-14 18:19:55', '2025-05-14 18:19:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `codigo_postal` varchar(255) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `rol` enum('vendedor','cliente') NOT NULL DEFAULT 'cliente',
  `provincia` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `email_verified_at`, `contraseña`, `direccion`, `telefono`, `ciudad`, `codigo_postal`, `pais`, `remember_token`, `created_at`, `updated_at`, `rol`, `provincia`) VALUES
(1, 'Reloj Amego', 'paudomec1212@gmail.com', NULL, '$2y$12$DbDcIK8cKT8vxcDm7toFBunWT6NKq4BLSgi9qpZzrOVQLsTL6TcnG', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 18:20:36', '2025-05-14 18:20:36', 'cliente', NULL),
(3, 'admin', 'admin@admin.com', NULL, '$2y$12$D9qJJk8QwaLqSATVblzRUuDbtZf8r3A3s86S3VYAPYp6vTYVccDny', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15 08:16:39', 'vendedor', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoraciones`
--

CREATE TABLE `valoraciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `puntuacion` int(11) NOT NULL COMMENT 'Valoración de 1 a 5',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carritos_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `carrito_productos`
--
ALTER TABLE `carrito_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carrito_productos_carrito_id_foreign` (`carrito_id`),
  ADD KEY `carrito_productos_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_cat`),
  ADD UNIQUE KEY `categorias_nombre_unique` (`nombre`);

--
-- Indices de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categoria_producto_categoria_id_producto_id_unique` (`categoria_id`,`producto_id`),
  ADD KEY `categoria_producto_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalles_pedido_pedido_id_foreign` (`pedido_id`),
  ADD KEY `detalles_pedido_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `metodos_pago_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `opiniones`
--
ALTER TABLE `opiniones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `opiniones_producto_id_foreign` (`producto_id`),
  ADD KEY `opiniones_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedidos_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_prod`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `valoraciones_producto_id_foreign` (`producto_id`),
  ADD KEY `valoraciones_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `carrito_productos`
--
ALTER TABLE `carrito_productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_cat` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `opiniones`
--
ALTER TABLE `opiniones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_prod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `carritos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `carrito_productos`
--
ALTER TABLE `carrito_productos`
  ADD CONSTRAINT `carrito_productos_carrito_id_foreign` FOREIGN KEY (`carrito_id`) REFERENCES `carritos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carrito_productos_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_prod`);

--
-- Filtros para la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  ADD CONSTRAINT `categoria_producto_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_cat`) ON DELETE CASCADE,
  ADD CONSTRAINT `categoria_producto_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_prod`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `detalles_pedido_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_pedido_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_prod`) ON DELETE CASCADE;

--
-- Filtros para la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD CONSTRAINT `metodos_pago_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `opiniones`
--
ALTER TABLE `opiniones`
  ADD CONSTRAINT `opiniones_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_prod`) ON DELETE CASCADE,
  ADD CONSTRAINT `opiniones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD CONSTRAINT `valoraciones_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_prod`) ON DELETE CASCADE,
  ADD CONSTRAINT `valoraciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
