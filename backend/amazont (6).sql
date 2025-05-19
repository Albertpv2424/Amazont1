-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2025 a las 19:02:01
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

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
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actiu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`id`, `user_id`, `total`, `estado`, `created_at`, `updated_at`) VALUES
(1, 1, '0.00', 'finalizado', '2025-05-14 18:20:46', '2025-05-19 14:44:45'),
(2, 4, '0.00', 'actiu', '2025-05-15 12:27:56', '2025-05-15 12:27:56');

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
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
(17, 3, 15, '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(23, 1, 20, NULL, NULL),
(24, 2, 20, NULL, NULL),
(25, 1, 21, NULL, NULL),
(26, 2, 21, NULL, NULL),
(27, 1, 22, NULL, NULL),
(28, 2, 22, NULL, NULL);

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_tarjeta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_titular` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cvv` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_expiracion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_paypal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_banco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `es_predeterminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id`, `user_id`, `tipo`, `numero_tarjeta`, `nombre_titular`, `cvv`, `fecha_expiracion`, `email_paypal`, `iban`, `nombre_banco`, `es_predeterminado`, `created_at`, `updated_at`) VALUES
(1, 1, 'paypal', NULL, NULL, NULL, NULL, 'dani@normal.normal', NULL, NULL, 1, '2025-05-16 12:14:13', '2025-05-16 12:14:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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
(18, '2025_05_12_050000_create_categoria_producto_table', 1),
(19, '2025_05_15_000001_add_user_id_to_productos_table', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opiniones`
--

CREATE TABLE `opiniones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `opiniones`
--

INSERT INTO `opiniones` (`id`, `producto_id`, `user_id`, `titulo`, `comentario`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Muy buena', 'Me ha encantado', '2025-05-16 12:35:31', '2025-05-16 12:35:31'),
(2, 2, 1, 'Genial!', 'Supera les expectatives, repetiré segur.', '2025-05-16 12:36:18', '2025-05-16 12:36:18'),
(3, 15, 1, 'Un imprescindible', 'Ara no puc viure sense ell!', '2025-05-16 12:36:24', '2025-05-16 12:36:24'),
(4, 14, 1, 'Qualitat-preu 10/10', 'Gran rendiment a un preu molt raonable.', '2025-05-16 12:36:37', '2025-05-16 12:36:37'),
(5, 13, 1, 'Perfecte per regalar', 'Va agradar molt, repetiré per a altres ocasions.', '2025-05-16 12:36:46', '2025-05-16 12:36:46'),
(6, 12, 1, 'Agradable sorpresa', 'Millor del que esperava. S’ho val.', '2025-05-16 12:36:51', '2025-05-16 12:36:51'),
(7, 11, 1, 'Elegant', 'Té un disseny preciós i funciona de meravella.', '2025-05-16 12:37:00', '2025-05-16 12:37:00'),
(8, 3, 1, 'Top', 'Molt bona qualitat i ràpid enviament.', '2025-05-16 12:37:28', '2025-05-16 12:37:28'),
(9, 10, 1, 'Molt útil', 'Em facilita molt el dia a dia. Gràcies!', '2025-05-16 12:37:36', '2025-05-16 12:37:36'),
(10, 9, 1, 'Excel·lent elecció', 'Estic molt satisfet amb aquest producte.', '2025-05-16 12:37:41', '2025-05-16 12:37:41'),
(11, 8, 1, 'Fantàstic', 'Color, textura i funcionalitat excel·lents!', '2025-05-16 12:37:45', '2025-05-16 12:37:45'),
(12, 7, 1, 'Correcte', 'Funciona bé, tot i que podria millorar una mica.', '2025-05-16 12:37:52', '2025-05-16 12:37:52'),
(13, 6, 1, 'Molt recomanable', 'Ideal per a ús diari. Molt content amb la compra.', '2025-05-16 12:37:55', '2025-05-16 12:37:55'),
(14, 5, 1, 'Sorprenent', 'No m’esperava que fos tan bo. Bravo!', '2025-05-16 12:37:59', '2025-05-16 12:37:59'),
(15, 4, 1, 'Encantat', 'Just el que buscava, gràcies!', '2025-05-16 12:38:03', '2025-05-16 12:38:03'),
(16, 1, 1, 'soc gay', '1234214211', '2025-05-16 13:06:08', '2025-05-16 13:06:08'),
(17, 1, 1, 'asdasddas', 'dasdasdasdas', '2025-05-16 13:09:34', '2025-05-16 13:09:34'),
(18, 1, 1, 'asdasddas', '123124124', '2025-05-16 13:27:14', '2025-05-16 13:27:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `metodo_pago_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `user_id`, `total`, `estado`, `metodo_pago_id`, `created_at`, `updated_at`) VALUES
(1, 1, '12.00', 'pendiente', 1, '2025-05-19 14:44:44', '2025-05-19 14:44:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
(7, 'App\\Models\\User', 3, 'auth_token', '181f6945623745864b4db1b9ad7979f9f330825f181265edfa3f426e8a601a1f', '[\"*\"]', NULL, NULL, '2025-05-15 12:10:17', '2025-05-15 12:10:17'),
(8, 'App\\Models\\User', 3, 'auth_token', '6eab5f8ef6550af55f401f2114c87ac9675d2ca65c025b14baa09a2d364e6441', '[\"*\"]', NULL, NULL, '2025-05-15 12:10:20', '2025-05-15 12:10:20'),
(9, 'App\\Models\\User', 4, 'auth_token', '30b8006cf17a3fdcb173c6d96403b3475b878233dfc90a526e012459e1b5a297', '[\"*\"]', NULL, NULL, '2025-05-15 12:15:36', '2025-05-15 12:15:36'),
(23, 'App\\Models\\User', 4, 'auth_token', '8aa6a643804afd3659d21a3b750f613e4746b8bf4a9f9717d38202a66d097c83', '[\"*\"]', '2025-05-15 13:30:29', NULL, '2025-05-15 13:29:54', '2025-05-15 13:30:29'),
(26, 'App\\Models\\User', 1, 'auth_token', 'cbf388ca358c90b1e8ba901321796a2d4128877503021a13f0742f51290a271b', '[\"*\"]', '2025-05-16 13:37:10', NULL, '2025-05-16 12:26:23', '2025-05-16 13:37:10'),
(27, 'App\\Models\\User', 1, 'auth_token', '480d006878adaeafa0c0e6276eb5038bb585a055bca9032ab7e08458a5c8a2ea', '[\"*\"]', NULL, NULL, '2025-05-16 12:30:56', '2025-05-16 12:30:56'),
(28, 'App\\Models\\User', 4, 'auth_token', 'e3dc62e199953aeaf3a1823b298a770154ecf5cf1631c8306bcccf1b6a08a4ab', '[\"*\"]', '2025-05-16 13:59:54', NULL, '2025-05-16 13:39:09', '2025-05-16 13:59:54'),
(37, 'App\\Models\\User', 1, 'auth_token', '24a4280414e1c0482a1083ebb5d8b75501afe318b5ee06e66ca98a0893b37496', '[\"*\"]', NULL, NULL, '2025-05-19 15:01:37', '2025-05-19 15:01:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_prod` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `en_oferta` tinyint(1) NOT NULL DEFAULT 0,
  `precio_oferta` decimal(10,2) DEFAULT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_prod`, `user_id`, `nombre`, `descripcion`, `precio`, `stock`, `en_oferta`, `precio_oferta`, `imagen`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Balón de Fútbol Profesional', 'Balón oficial de la Liga, diseño 2024', '29.99', 2, 1, '26.99', 'balon.png', '2025-05-14 18:19:55', '2025-05-15 13:55:15'),
(2, NULL, 'Raqueta de Tenis Pro', 'Raqueta profesional de grafito', '189.99', 25, 0, NULL, 'raqueta.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(3, NULL, 'Bicicleta de Montaña', 'Bicicleta todo terreno con 21 velocidades', '499.99', 25, 1, '449.99', 'bicicleta.jpg', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(4, NULL, 'Set de Pesas', 'Set completo de pesas ajustables', '299.99', 25, 0, NULL, 'pesas.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(5, NULL, 'Zapatillas Running', 'Zapatillas profesionales para correr', '89.99', 25, 1, '76.49', 'zapatillas.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(6, NULL, 'Laptop Gaming Pro', 'Laptop gaming con RTX 4080', '1499.99', 25, 1, '1199.99', 'laptop.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(7, NULL, 'Smartphone Ultimate', 'Último modelo con cámara 108MP', '899.99', 25, 0, NULL, 'smartphone.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(8, NULL, 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', '199.99', 25, 1, '179.99', 'auriculares.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(9, NULL, 'Smartwatch Pro', 'Reloj inteligente con GPS y monitor cardíaco', '299.99', 25, 0, NULL, 'smartwatch.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(10, NULL, 'Tablet 4K', 'Tablet de 12\" con pantalla 4K', '699.99', 25, 1, '664.99', 'tablet.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(11, NULL, 'Robot de Cocina', 'Robot de cocina multifunción', '599.99', 25, 0, NULL, 'robot-cocina.jpg', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(12, NULL, 'Batidora Profesional', 'Batidora de alta potencia para smoothies', '129.99', 25, 1, '109.99', 'batidora.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(13, NULL, 'Set de Cuchillos', 'Set profesional de cuchillos de cocina', '199.99', 25, 0, NULL, 'cuchillos.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(14, NULL, 'Cafetera Espresso', 'Cafetera automática con molinillo', '399.99', 25, 1, '359.99', 'cafetera.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(15, NULL, 'Horno Eléctrico', 'Horno eléctrico de convección', '299.99', 25, 0, NULL, 'horno.png', '2025-05-14 18:19:55', '2025-05-14 18:19:55'),
(20, NULL, 'Producte Prova', 'Descripció del producte', '49.99', 20, 0, NULL, 'url_or_base64', '2025-05-16 13:40:03', '2025-05-16 13:40:03'),
(21, NULL, 'Producte 1Prova', 'Descripció del producte', '49.99', 20, 0, NULL, 'url_or_base64', '2025-05-16 13:41:05', '2025-05-16 13:41:05'),
(22, NULL, 'Producte 11Prova', 'Descripció del producte', '49.99', 20, 0, NULL, 'url_or_base64', '2025-05-16 13:44:49', '2025-05-16 13:44:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `contraseña` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ciudad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_postal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `rol` enum('vendedor','cliente') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `provincia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `email_verified_at`, `contraseña`, `direccion`, `telefono`, `ciudad`, `codigo_postal`, `pais`, `remember_token`, `created_at`, `updated_at`, `rol`, `provincia`) VALUES
(1, 'Reloj Amego', 'paudomec1212@gmail.com', NULL, '$2y$12$Fcad2bhgLMErVs853BDMBO1DILW9VbXI8wG6j5kdFqip2JbirQ3VK', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-14 18:20:36', '2025-05-16 12:30:08', 'cliente', NULL),
(4, 'Albert', 'a@gmail.com', NULL, '$2y$12$5u9k12uV4UQ9nHTi2sK8vejo.d6ekVIP2C.POuLxjDh0HHiR9P2jy', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15 12:15:36', '2025-05-15 12:15:36', 'vendedor', NULL);

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
-- Volcado de datos para la tabla `valoraciones`
--

INSERT INTO `valoraciones` (`id`, `producto_id`, `user_id`, `puntuacion`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, '2025-05-16 13:06:08', '2025-05-16 13:09:34');

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
  ADD PRIMARY KEY (`id_prod`),
  ADD KEY `productos_user_id_foreign` (`user_id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `carrito_productos`
--
ALTER TABLE `carrito_productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_cat` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `opiniones`
--
ALTER TABLE `opiniones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_prod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
