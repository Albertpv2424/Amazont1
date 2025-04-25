-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-04-2025 a las 14:08:37
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
(1, 'Electrónica', 'Productos con bateria cuyos usan electricidad', NULL, NULL, NULL),
(2, 'Electrónicos', 'Productos electrónicos y gadgets', NULL, '2025-03-18 17:21:31', '2025-03-18 17:21:31'),
(3, 'ElectrónicosTEST', 'M\'he oblidat la captura', NULL, '2025-03-18 17:31:42', '2025-03-18 17:31:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `card_number` varchar(255) DEFAULT NULL,
  `card_holder_name` varchar(255) DEFAULT NULL,
  `expiration_date` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id`, `user_id`, `tipo`, `card_number`, `card_holder_name`, `expiration_date`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 'credit_card', '4111111111111111', 'John Doe', '12/2025', 1, '2025-03-18 17:54:29', '2025-03-18 17:54:29');

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
(3, '2025_03_17_184905_create_categories_table', 1),
(4, '2025_03_17_184905_create_orders_table', 1),
(5, '2025_03_17_184905_create_products_table', 1),
(6, '2025_03_17_184906_create_order_items_table', 1),
(7, '2025_03_17_184907_create_payment_methods_table', 1),
(8, '2025_03_18_000001_add_image_to_categories_table', 2),
(9, '2025_03_18_000002_create_reviews_table', 2),
(10, '2025_03_18_000003_create_ratings_table', 2),
(11, '2025_04_01_000001_add_imagen_to_productos_table', 3),
(12, '2025_03_17_create_add_role_to_users_table', 4),
(13, '2025_03_177_create_add_role_to_users_table', 5);

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
(1, 1, 1, 'Albert Empanat', 'La vdd esq el producte es la pollaa', '2025-04-01 09:43:48', '2025-04-01 09:43:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'pending',
  `metodo_pago_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `user_id`, `total`, `estado`, `metodo_pago_id`, `created_at`, `updated_at`) VALUES
(1, 1, 0.00, 'pending', NULL, '2025-04-01 09:44:49', '2025-04-01 09:44:49'),
(2, 1, 0.00, 'pending', NULL, '2025-04-01 09:46:25', '2025-04-01 09:46:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedir_productos`
--

CREATE TABLE `pedir_productos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedir_productos`
--

INSERT INTO `pedir_productos` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, 499.99, '2025-04-01 09:44:49', '2025-04-01 09:44:49'),
(2, 2, 1, 2, 499.99, '2025-04-01 09:46:25', '2025-04-01 09:46:25');

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
(1, 'App\\Models\\User', 1, 'auth_token', '69b52f8dd1b40b06f2fdf0a1e5874b5e45a9e59d61dcb10174984c3f04cc8841', '[\"*\"]', NULL, NULL, '2025-03-18 17:18:59', '2025-03-18 17:18:59'),
(2, 'App\\Models\\User', 1, 'auth_token', 'a2a790d8d028bf2eafcb94d08f19536a3fad1ccdeeb7df97a5628606e1d33760', '[\"*\"]', '2025-03-31 15:55:19', NULL, '2025-03-18 17:19:48', '2025-03-31 15:55:19'),
(3, 'App\\Models\\User', 2, 'auth_token', '575d436064c25de454fb1d82262fd2510ab317cf945024e7f94edc981a95279d', '[\"*\"]', NULL, NULL, '2025-03-31 15:15:23', '2025-03-31 15:15:23'),
(4, 'App\\Models\\User', 1, 'auth_token', 'adc0885db72be82077facbd5f2f53ca2d9d496c1d8d6ed79329c0a04bba374b6', '[\"*\"]', '2025-04-01 09:46:25', NULL, '2025-04-01 09:39:32', '2025-04-01 09:46:25'),
(5, 'App\\Models\\User', 3, 'auth_token', '41ecaa5ccd2e6bba01fb8075f32897133cce871ab308b7458555b1c5e5d70806', '[\"*\"]', NULL, NULL, '2025-04-01 10:08:18', '2025-04-01 10:08:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_prod` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descricion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `rebajas` tinyint(1) NOT NULL DEFAULT 0,
  `precio_rebajado` decimal(10,2) DEFAULT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_prod`, `nombre`, `descricion`, `precio`, `stock`, `rebajas`, `precio_rebajado`, `categoria_id`, `imagen`, `created_at`, `updated_at`) VALUES
(1, 'Smartphone XYZZZ', 'Un smartphone de última generación con excelentes características', 599.99, 46, 1, 499.99, 1, NULL, '2025-03-18 17:29:44', '2025-04-01 09:46:25'),
(2, 'Laptop Gaming Pro X', 'Potente laptop gaming con procesador de última generación, tarjeta gráfica dedicada y pantalla de alta resolución', 1299.99, 15, 1, 1099.99, 1, NULL, '2025-03-18 17:35:17', '2025-03-18 17:35:17'),
(3, 'Smartphone Ultra Plus', 'Smartphone de gama alta con cámara profesional, pantalla AMOLED y batería de larga duración', 899.99, 30, 0, NULL, 1, NULL, '2025-03-18 17:35:29', '2025-03-18 17:35:29'),
(4, 'Smartphone XYZZ', 'Un smartphone de última generación con excelentes características', 599.99, 50, 1, 499.99, 1, NULL, '2025-03-24 14:17:14', '2025-03-24 14:17:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verificado` timestamp NULL DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `dirección` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `codigo_postal` varchar(255) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'customer',
  `rol` varchar(255) NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `email_verificado`, `contraseña`, `dirección`, `telefono`, `ciudad`, `codigo_postal`, `pais`, `remember_token`, `created_at`, `updated_at`, `role`, `rol`) VALUES
(1, 'Test User', 'test@example.com', NULL, '$2y$12$hUhePmKj8xM1kCzSAaD.j.iNZRLA1yEC6J1BQZI1M.yEKkisKX2gC', 'New Address', NULL, NULL, NULL, NULL, NULL, '2025-03-18 17:18:59', '2025-04-01 09:42:56', 'customer', 'customer'),
(2, 'John Doe', 'john@example.com', NULL, '$2y$12$Qn9pdxsX1Ax3h6EbF0spNe1MGIBACZkDKo9xeWB8NmZoyw11/3.hS', '123 Main St', '123456789', 'Barcelona', '08001', 'Spain', NULL, '2025-03-31 15:15:23', '2025-03-31 15:15:23', 'customer', 'customer'),
(3, 'Admin User', 'admin@example.com', NULL, '$2y$12$xqR0WmgalxZ.eg51C97/C.VgRhXSbznDHG1BDO1AD7KUldiUQa14O', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-01 10:08:18', '2025-04-01 10:08:18', 'customer', 'admin');

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
(1, 1, 1, 4, '2025-04-01 09:44:32', '2025-04-01 09:44:32');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_cat`),
  ADD UNIQUE KEY `categorias_nombre_unique` (`nombre`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `metodo_pago_user_id_foreign` (`user_id`);

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
-- Indices de la tabla `pedir_productos`
--
ALTER TABLE `pedir_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedir_productos_pedido_id_foreign` (`pedido_id`),
  ADD KEY `pedir_productos_producto_id_foreign` (`producto_id`);

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
  ADD KEY `productos_categoria_id_foreign` (`categoria_id`);

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
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_cat` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
-- AUTO_INCREMENT de la tabla `pedir_productos`
--
ALTER TABLE `pedir_productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_prod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD CONSTRAINT `metodo_pago_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
-- Filtros para la tabla `pedir_productos`
--
ALTER TABLE `pedir_productos`
  ADD CONSTRAINT `pedir_productos_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedir_productos_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_prod`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_cat`) ON DELETE CASCADE;

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
