-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-05-2025 a las 15:11:03
-- Versión del servidor: 10.4.32-MariaDB
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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`id`, `user_id`, `total`, `created_at`, `updated_at`, `estado`) VALUES
(1, 2, 399.96, '2025-05-12 10:51:27', '2025-05-13 06:59:48', 'finalizado');

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

--
-- Volcado de datos para la tabla `carrito_productos`
--

INSERT INTO `carrito_productos` (`id`, `carrito_id`, `producto_id`, `cantidad`, `precio`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 4, 99.99, '2025-05-12 10:51:27', '2025-05-13 06:59:48');

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
(1, 'Electrónica', 'Productos electrónicos', NULL, '2025-05-12 01:39:12', '2025-05-12 01:39:12'),
(2, 'New Product', NULL, NULL, '2025-05-12 01:40:27', '2025-05-12 01:40:27'),
(3, 'Electrónicaa', 'Productos electrónicos', NULL, '2025-05-12 02:09:06', '2025-05-12 02:09:06'),
(4, 'Nom del producte', NULL, NULL, '2025-05-12 02:09:17', '2025-05-12 02:09:17');

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
(1, 1, 3, NULL, NULL),
(2, 2, 3, NULL, NULL),
(3, 3, 3, NULL, NULL);

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
(1, 2, 1, 2, 99.99, '2025-05-13 07:25:02', '2025-05-13 07:25:02');

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
(1, 2, 'paypal', NULL, NULL, NULL, NULL, 'usuario@paypal.com', NULL, NULL, 1, '2025-05-13 06:57:54', '2025-05-13 06:57:54');

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
(14, '2025_04_10_000001_add_fields_to_payment_methods_table', 1),
(15, '2025_04_15_000001_add_shipping_address_to_users_table', 1),
(16, 'xxxx_xx_xx_xxxxxx_add_estado_to_carritos_table', 1),
(17, '2025_05_12_041426_remove_categoria_id_from_productos_table', 2),
(18, '2025_05_12_050000_create_categoria_producto_table', 3);

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

--
-- Volcado de datos para la tabla `opiniones`
--

INSERT INTO `opiniones` (`id`, `producto_id`, `user_id`, `titulo`, `comentario`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Muy buena', 'Me ha encantado', '2025-05-12 10:25:11', '2025-05-12 10:25:11');

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
(2, 2, 199.98, 'pendiente', 1, '2025-05-13 07:25:02', '2025-05-13 07:25:02');

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
(1, 'App\\Models\\User', 1, 'auth_token', '5e16a2d48f397af028d76eae5c0ea0a5c109ce6a643b9705bb5f720d1d3267b0', '[\"*\"]', NULL, NULL, '2025-05-12 01:20:37', '2025-05-12 01:20:37'),
(2, 'App\\Models\\User', 1, 'auth_token', 'f42ebab5d91ba496b266d3640fe3a217b3c7df8b0e047f8959f00ddf592e6c97', '[\"*\"]', NULL, NULL, '2025-05-12 01:35:17', '2025-05-12 01:35:17'),
(3, 'App\\Models\\User', 1, 'auth_token', '13ce6c17c90abe13589382916a8a189a0ae758041f977c463d95ef4143f3d5dc', '[\"*\"]', '2025-05-12 01:49:20', NULL, '2025-05-12 01:36:01', '2025-05-12 01:49:20'),
(4, 'App\\Models\\User', 2, 'auth_token', 'fe9bbb55f5c771ba9c38b20f383044b9f648ad31e8468c5effa8b86844358552', '[\"*\"]', NULL, NULL, '2025-05-12 01:45:48', '2025-05-12 01:45:48'),
(5, 'App\\Models\\User', 2, 'auth_token', '5cbcfaeabea964f4b85fcca1d552c7f04d89839725d64a1b7eb678194f09dcd3', '[\"*\"]', '2025-05-13 07:25:02', NULL, '2025-05-12 01:46:36', '2025-05-13 07:25:02'),
(6, 'App\\Models\\User', 1, 'auth_token', 'a36ccee3f753f267609767559033456612f6293d4875ac7de394a5ea860429dd', '[\"*\"]', NULL, NULL, '2025-05-13 08:07:54', '2025-05-13 08:07:54'),
(7, 'App\\Models\\User', 1, 'auth_token', 'c6b0d03537a75f44de4232a99f86cb9a831a86bb2160bff412f05a984c7c5fcb', '[\"*\"]', NULL, NULL, '2025-05-13 08:08:20', '2025-05-13 08:08:20'),
(8, 'App\\Models\\User', 1, 'auth_token', '754ab6aaaeacb05ae0ec6deeacc2c651a4cfeb2758be5d16a017c14c19a1ca6b', '[\"*\"]', NULL, NULL, '2025-05-13 08:08:42', '2025-05-13 08:08:42'),
(9, 'App\\Models\\User', 3, 'auth_token', 'a0720cc1ebcaa0b0ba2ac511d5b87336d68be3b78b1b5e70a9acfbd7447b541b', '[\"*\"]', NULL, NULL, '2025-05-13 08:19:25', '2025-05-13 08:19:25'),
(10, 'App\\Models\\User', 4, 'auth_token', 'a90bd6085d31179248e91e8c0c31e2f89ff31594a21fae13c800c9467c52b5b8', '[\"*\"]', NULL, NULL, '2025-05-13 08:24:41', '2025-05-13 08:24:41'),
(11, 'App\\Models\\User', 5, 'auth_token', '1dd9c06b3b3c286153949d361bd25dafb95d0dc9619230bf4ef431bf10d0a09a', '[\"*\"]', NULL, NULL, '2025-05-13 08:40:34', '2025-05-13 08:40:34'),
(12, 'App\\Models\\User', 5, 'auth_token', '327d68cb717e9fa5cd4d303d1c1570926bc99963331c33fb4bccd8ac904a3a6a', '[\"*\"]', NULL, NULL, '2025-05-13 08:40:57', '2025-05-13 08:40:57'),
(13, 'App\\Models\\User', 5, 'auth_token', 'f7b54a8fc18dfbb238f7b6d84dd806f1f7205318f0be8f8e99e2d500b5700635', '[\"*\"]', NULL, NULL, '2025-05-13 09:00:38', '2025-05-13 09:00:38'),
(14, 'App\\Models\\User', 5, 'auth_token', '3e2d0ec87de98ba8689b6004ab84e34c7fb9390bf1bb91876d347ca347035c10', '[\"*\"]', NULL, NULL, '2025-05-13 09:04:06', '2025-05-13 09:04:06'),
(15, 'App\\Models\\User', 5, 'auth_token', '86ea77400c22dc02d656f8b46d48821f1422bdea0dbac116d3a32031c377b02c', '[\"*\"]', NULL, NULL, '2025-05-13 09:06:54', '2025-05-13 09:06:54'),
(16, 'App\\Models\\User', 5, 'auth_token', '2291b6e65f4c376def0c78630ab7dba3552900bac9d53aa58ad0cbbc2d15936a', '[\"*\"]', NULL, NULL, '2025-05-13 09:14:40', '2025-05-13 09:14:40'),
(17, 'App\\Models\\User', 5, 'auth_token', 'da0f660664fcfe7577c0d328c954aebfdad02a62c8bea2f9ff23d33057e38c54', '[\"*\"]', NULL, NULL, '2025-05-13 09:26:49', '2025-05-13 09:26:49'),
(18, 'App\\Models\\User', 5, 'auth_token', 'd9618202c61f5f1719addcf02f34dc0479269d6ee4e192f2986687c605575bc0', '[\"*\"]', NULL, NULL, '2025-05-13 09:27:10', '2025-05-13 09:27:10'),
(19, 'App\\Models\\User', 5, 'auth_token', '3b991f626fa3a0ed583d1bd1fc392cc650da849783268d1b15de562a31f2e936', '[\"*\"]', NULL, NULL, '2025-05-13 09:31:30', '2025-05-13 09:31:30'),
(20, 'App\\Models\\User', 5, 'auth_token', '7e391b20c3a85a3a8a73b9054395be1d5b063623ca338c0529dab8b924b33048', '[\"*\"]', NULL, NULL, '2025-05-13 09:33:29', '2025-05-13 09:33:29');

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
(1, 'Product Name', 'Description', 99.99, 48, 0, NULL, 'url_or_base64', '2025-05-12 01:59:43', '2025-05-13 07:25:02'),
(3, 'Camiseta multicolor', NULL, 25.99, 50, 0, NULL, NULL, '2025-05-12 02:18:28', '2025-05-12 02:18:28');

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
(1, 'Nom Prova', 'prova@email.com', NULL, '$2y$12$zwlmYH049gCSPJUcCWfCAOIcM9vyiJdmCfLY/UT/Jr3aaBNb3wY.2', 'Carrer Falsa 123', '123456789', 'Barcelona', '08001', 'Espanya', NULL, '2025-05-12 01:20:36', '2025-05-12 01:20:36', 'cliente', NULL),
(2, 'Nom Prova', 'vendedor@email.com', NULL, '$2y$12$QUVhDUyZPbCoEJTvwSo85OBsO0eiKQKAoSZz860yp/1EJ6ZU.6T0i', 'Carrer Falsa 123', '123456789', 'Barcelona', '08001', 'Espanya', NULL, '2025-05-12 01:45:48', '2025-05-12 01:45:48', 'vendedor', NULL),
(3, 'Nom Prova1', 'prova1@email.com', NULL, '$2y$12$Ag1y6C64ZqtcjIo7gAtV3emA..ljXrh.dTK47NPk2IoKOGGofMtfS', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-13 08:19:25', '2025-05-13 08:19:25', 'cliente', NULL),
(4, 'Nom Prova1', 'prova2@email.com', NULL, '$2y$12$1HqhPdOIeMWzwt.ObzlvFuuw1tHZ14rDlTvcdhu7kWSK9wNBmCcfe', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-13 08:24:41', '2025-05-13 08:24:41', 'cliente', NULL),
(5, 'Reloj Amego', 'paudomec1212@gmail.com', NULL, '$2y$12$tLJV4zmQP9u9yGLaXfYDoeCQT.f5c9bpvIoXB/SXMhsuR4lR03noW', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-13 08:40:34', '2025-05-13 08:40:34', 'cliente', NULL);

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
(1, 1, 2, 5, '2025-05-12 10:26:04', '2025-05-12 10:26:04');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_cat` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_prod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- Filtros para la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD CONSTRAINT `valoraciones_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_prod`) ON DELETE CASCADE,
  ADD CONSTRAINT `valoraciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
