-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: clothing_store
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `detail_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (35,17,19,19,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Dress',0),(2,'Women\'s Blazer',0),(3,'Skirt',0),(4,'Women\'s Pants',0),(5,'Women\'s Top',0),(6,'T-shirt',0),(7,'Vietnamese Traditional Dress',0),(8,'Trench Coat',0),(9,'Ghế gamingg',1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_detail_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `detail_id` int NOT NULL,
  PRIMARY KEY (`order_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,1,1,3196000.00,21),(2,1,2,3296000.00,1),(3,2,1,9323000.00,20),(4,2,2,9996000.00,19),(5,3,1,2096000.00,14),(6,4,1,3196000.00,24),(7,4,3,9323000.00,20),(8,5,1,2696000.00,5),(9,5,2,9323000.00,20),(10,5,2,2096000.00,14),(11,6,1,9996000.00,19),(12,7,1,3196000.00,22),(13,8,2,1596000.00,13),(14,9,1,3196000.00,24),(15,9,1,2096000.00,14),(16,10,1,1996000.00,11),(17,11,4,9323000.00,20),(18,12,1,9323000.00,23),(19,13,1,1996000.00,12),(20,13,1,1596000.00,13),(21,14,1,3196000.00,22),(22,14,1,8996000.00,2),(23,15,1,9323000.00,20),(24,16,2,1996000.00,11),(25,16,1,1996000.00,12),(26,17,1,9323000.00,20),(27,17,1,9996000.00,19),(28,18,1,2096000.00,14),(29,19,1,3196000.00,22),(30,20,2,1596000.00,13),(31,21,1,9323000.00,23),(32,22,2,9996000.00,19),(33,22,1,9323000.00,23);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_status` enum('pending','processing','shipped','delivered','canceled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,17,9788000.00,'canceled','2025-04-20 09:20:39',0),(2,17,29315000.00,'pending','2025-04-20 09:21:24',0),(3,17,2096000.00,'shipped','2025-04-20 09:21:51',0),(4,17,31165000.00,'pending','2025-04-20 09:30:54',0),(5,15,25534000.00,'canceled','2025-04-20 14:49:30',0),(6,15,9996000.00,'canceled','2025-04-20 14:49:41',0),(7,15,3196000.00,'canceled','2025-04-20 14:49:55',0),(8,15,3192000.00,'canceled','2025-04-20 14:50:11',0),(9,15,5292000.00,'pending','2025-04-20 14:50:33',0),(10,15,1996000.00,'pending','2025-04-20 14:50:46',0),(11,15,37292000.00,'pending','2025-04-20 14:50:59',0),(12,15,9323000.00,'pending','2025-04-20 14:51:20',0),(13,15,3592000.00,'pending','2025-04-20 14:51:40',0),(14,17,12192000.00,'canceled','2025-04-20 14:52:40',0),(15,17,9323000.00,'canceled','2025-04-20 14:52:49',0),(16,17,5988000.00,'pending','2025-04-20 14:53:15',0),(17,7,19319000.00,'canceled','2025-04-20 14:54:25',0),(18,7,2096000.00,'canceled','2025-04-20 14:54:46',0),(19,7,3196000.00,'canceled','2025-04-20 14:54:58',0),(20,7,3192000.00,'pending','2025-04-20 14:55:13',0),(21,7,9323000.00,'pending','2025-04-20 14:55:25',0),(22,17,29315000.00,'canceled','2025-04-21 00:41:19',0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` enum('COD','Credit Card','Bank Transfer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('pending','completed','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'COD','pending','2025-04-20 09:20:39',0),(2,2,'COD','pending','2025-04-20 09:21:24',0),(3,3,'COD','pending','2025-04-20 09:21:51',0),(4,4,'COD','pending','2025-04-20 09:30:54',0),(5,5,'COD','pending','2025-04-20 14:49:30',0),(6,6,'COD','pending','2025-04-20 14:49:41',0),(7,7,'COD','pending','2025-04-20 14:49:55',0),(8,8,'COD','pending','2025-04-20 14:50:11',0),(9,9,'COD','pending','2025-04-20 14:50:33',0),(10,10,'COD','pending','2025-04-20 14:50:46',0),(11,11,'COD','pending','2025-04-20 14:50:59',0),(12,12,'COD','pending','2025-04-20 14:51:20',0),(13,13,'COD','pending','2025-04-20 14:51:40',0),(14,14,'COD','pending','2025-04-20 14:52:40',0),(15,15,'COD','pending','2025-04-20 14:52:49',0),(16,16,'COD','pending','2025-04-20 14:53:15',0),(17,17,'COD','pending','2025-04-20 14:54:25',0),(18,18,'COD','pending','2025-04-20 14:54:46',0),(19,19,'COD','pending','2025-04-20 14:54:58',0),(20,20,'COD','pending','2025-04-20 14:55:13',0),(21,21,'COD','pending','2025-04-20 14:55:25',0),(22,22,'COD','pending','2025-04-21 00:41:19',0);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_details`
--

DROP TABLE IF EXISTS `product_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_details` (
  `detail_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `color` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_quantity` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_details`
--

LOCK TABLES `product_details` WRITE;
/*!40000 ALTER TABLE `product_details` DISABLE KEYS */;
INSERT INTO `product_details` VALUES (1,1,'Beige','M',20,'/users/img/dress1.jpg',0),(2,2,'Dark Beige','M',15,'/users/img/dress2.jpg',0),(3,3,'White','M',25,'/users/img/dress3.jpg',0),(4,4,'White','M',30,'/users/img/dress4.jpg',0),(5,5,'White','M',20,'/users/img/dress5.jpg',0),(6,6,'Hồng','M',15,'/users/img/dress6.jpg',0),(7,7,'Brown','M',20,'/users/img/vest1.jpg',0),(8,8,'Light Cream','M',15,'/users/img/vest2.jpg',0),(9,9,'White','M',25,'/users/img/vest3.jpg',0),(10,10,'White','M',30,'/users/img/vest4.jpg',0),(11,11,'Black','M',17,'/users/img/vest5.jpg',0),(12,12,'Blue','M',13,'/users/img/vest6.jpg',0),(13,13,'Cream','M',17,'/users/img/Skirt1.jpg',0),(14,14,'Brown','L',13,'/users/img/Skirt2.jpg',0),(15,15,'Light Cream','S',25,'/users/img/Skirt3.jpg',0),(16,16,'White','S',30,'/users/img/Skirt4.jpg',0),(17,17,'White','M',20,'/users/img/Skirt5.jpg',0),(18,18,'Pink','M',15,'/users/img/Skirt6.jpg',0),(19,19,'Brownish-beige','S',18,'/users/img/Coat1.jpg',0),(20,20,'Pink','M',7,'/users/img/Coat2.jpg',0),(21,21,'Purple','L',25,'/users/img/Coat3.jpg',0),(22,22,'Green','M',30,'/users/img/Coat4.jpg',0),(23,23,'Orange','M',18,'/users/img/Coat5.jpg',0),(24,24,'Green','M',13,'/users/img/Coat6.jpg',0),(25,23,'Be','S',30,'/users/img/Coat4.jpg',0);
/*!40000 ALTER TABLE `product_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Flower Organza Flared Dress','A delicate flared dress made of organza with floral accents, perfect for elegant occasions.',3296000.00,'/users/img/dress1.jpg','2025-04-20 00:25:52',0),(2,1,'3D Flower Brocade Flared Dress','A luxurious flared dress with 3D flower brocade detailing, ideal for special events.',8996000.00,'/users/img/dress2.jpg','2025-04-20 00:25:52',0),(3,1,'Flower Embroidery Woven Loose Dress','A loose woven dress with intricate flower embroidery, offering a chic and comfortable look.',3296000.00,'/users/img/dress3.jpg','2025-04-20 00:25:52',0),(4,1,'Organza Flared Dress','A light and airy organza flared dress, perfect for a graceful and feminine style.',2896000.00,'/users/img/dress4.jpg','2025-04-20 00:25:52',0),(5,1,'Woven Flared Dress','A simple yet elegant woven flared dress, suitable for casual and semi-formal occasions.',2696000.00,'/users/img/dress5.jpg','2025-04-20 00:25:52',0),(6,1,'3D Flower Raw Loose Dress','A loose dress featuring raw 3D flower details, combining modern design with sophistication.',4496000.00,'/users/img/dress6.jpg','2025-04-20 00:25:52',0),(7,2,'Lace Vest','A stylish lace vest with intricate detailing, perfect for a chic layered look.',2896000.00,'/users/img/vest1.jpg','2025-04-20 00:36:02',0),(8,2,'Brocade Vest','A luxurious brocade vest with elegant patterns, ideal for formal occasions.',4696000.00,'/users/img/vest2.jpg','2025-04-20 00:36:02',0),(9,2,'Raw Vest','A minimalist raw vest, offering a modern and sophisticated style.',2896000.00,'/users/img/vest3.jpg','2025-04-20 00:36:02',0),(10,2,'Woven Vest','A woven vest with a clean design, suitable for both casual and semi-formal outfits.',1996000.00,'/users/img/vest4.jpg','2025-04-20 00:36:02',0),(11,2,'Bowtie Raw Vest','A raw vest featuring a bowtie detail, adding a touch of elegance to your look.',1996000.00,'/users/img/vest5.jpg','2025-04-20 00:36:02',0),(12,2,'Short Sleeves Raw Demi','A short-sleeve raw demi vest, combining modern design with a comfortable fit.',1996000.00,'/users/img/vest6.jpg','2025-04-20 00:36:02',0),(13,3,'Raw Loose Skirt','A comfortable raw loose skirt, perfect for a casual yet elegant look.',1596000.00,'/users/img/Skirt1.jpg','2025-04-20 00:43:23',0),(14,3,'Lace Flared Skirt','A flared skirt with intricate lace detailing, ideal for a feminine style.',2096000.00,'/users/img/Skirt2.jpg','2025-04-20 00:43:23',0),(15,3,'Brocade Pencil Skirt','A sleek brocade pencil skirt, suitable for formal and semi-formal occasions.',1696000.00,'/users/img/Skirt3.jpg','2025-04-20 00:43:23',0),(16,3,'Mesh Flared Skirt','A light mesh flared skirt, offering a breezy and stylish appearance.',1596000.00,'/users/img/Skirt4.jpg','2025-04-20 00:43:23',0),(17,3,'Voile Flared Skirt','A delicate voile flared skirt, perfect for a graceful and airy look.',1696000.00,'/users/img/Skirt5.jpg','2025-04-20 00:43:23',0),(18,3,'Organza Flared Skirt','A flared organza skirt with a soft, elegant design, ideal for special occasions.',1696000.00,'/users/img/Skirt6.jpg','2025-04-20 00:43:23',0),(19,8,'Long Sleeves Wool Coat','A warm wool coat with long sleeves, perfect for chilly days.',9996000.00,'/users/img/Coat1.jpg','2025-04-20 00:51:39',0),(20,8,'Double Breasted Long Coat','A stylish double-breasted long coat, ideal for a sophisticated look.',9323000.00,'/users/img/Coat2.jpg','2025-04-20 00:51:39',0),(21,8,'Notch Lapel Neck Long Coat','A long coat with a notch lapel neck, offering a classic and elegant style.',3196000.00,'/users/img/Coat3.jpg','2025-04-20 00:51:39',0),(22,8,'Nuggets Single Breasted Long Coat','A single-breasted long coat with a modern nuggets design, suitable for formal occasions.',3196000.00,'/users/img/Coat4.jpg','2025-04-20 00:51:39',0),(23,8,'Double Breasted Long Coat','A double-breasted long coat with a bold design, perfect for making a statement.',9323000.00,'/users/img/Coat5.jpg','2025-04-20 00:51:39',0),(24,8,'Peak Lapel Neck Long Coat','A long coat with a peak lapel neck, combining elegance and modernity.',3196000.00,'/users/img/Coat6.jpg','2025-04-20 00:51:39',0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statistics`
--

DROP TABLE IF EXISTS `statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statistics` (
  `stat_id` int NOT NULL AUTO_INCREMENT,
  `report_date` date NOT NULL,
  `total_orders` int NOT NULL,
  `total_revenue` decimal(15,2) NOT NULL,
  `total_customers` int NOT NULL,
  `top_selling_product` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`stat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statistics`
--

LOCK TABLES `statistics` WRITE;
/*!40000 ALTER TABLE `statistics` DISABLE KEYS */;
INSERT INTO `statistics` VALUES (1,'2024-03-01',50,200000000.00,40,'iPhone 15'),(2,'2024-03-02',45,180000000.00,38,'Samsung Galaxy S23'),(3,'2024-03-03',60,250000000.00,50,'MacBook Pro 16'),(4,'2024-03-04',55,230000000.00,45,'Dell XPS 15'),(5,'2024-03-05',70,300000000.00,60,'iPad Pro 12.9'),(6,'2024-03-06',40,150000000.00,35,'Samsung Galaxy Tab S9'),(7,'2024-03-07',65,280000000.00,55,'Apple Watch Ultra'),(8,'2024-03-08',50,210000000.00,43,'Samsung Galaxy Watch 5'),(9,'2024-03-09',75,320000000.00,65,'AirPods Pro 2'),(10,'2024-03-10',80,350000000.00,70,'Sony WF-1000XM5'),(11,'2024-03-11',55,220000000.00,48,'JBL Flip 6'),(12,'2024-03-12',60,240000000.00,52,'Bose SoundLink Revolve+'),(13,'2024-03-13',45,190000000.00,40,'LG OLED C3'),(14,'2024-03-14',35,140000000.00,30,'Canon EOS R5'),(15,'2024-03-15',50,200000000.00,42,'BenQ TK850');
/*!40000 ALTER TABLE `statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `role` enum('customer','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nguyễn Văn Anh','nguyenvana@example.com','hashed_password','0987654321','Hà Nội','customer','2025-03-11 01:56:48',0),(2,'Trần Thị khoan','tranthib@example.com','$2b$10$/p7bmS8/zVEx9.8ebJzGGOMrxcqcDWWP8OcCz4PZ2QuZMN5mCj8vK','0978123456','TP. Hồ Chí Minh','admin','2025-03-09 22:56:48',0),(3,'Lê Văn Cam','levanc@example.com','hashed_password','0968543217','Đà Nẵng','admin','2025-03-11 01:56:48',0),(4,'Phạm Thị Duy','phamthid@example.com','hashed_password','0956321478','Hải Phòng','customer','2025-04-10 18:56:48',0),(5,'Hoàng Văn E','hoangvane@example.com','hashed_password','0945678123','Cần Thơ','customer','2025-03-11 01:56:48',1),(6,'Đỗ Thị Fun','dothif@example.com','hashed_password','0934875621','Huế','customer','2025-03-11 01:56:48',0),(7,'Vũ Văn Goa','vuvang@example.com','$2b$10$IaHDImXf8UXg2FTj/YN2A.mkN8fFbf/XdaOn15KyPVeHI1ClBWOIa','0923456789','Bình Dương','customer','2025-03-11 01:56:48',0),(8,'Bùi Thị Hong','buithih@example.com','hashed_password','0912345678','Nghệ An','customer','2025-03-11 01:56:48',0),(9,'Ngô Văn Lê','ngovanii@example.com','hashed_password','0987123456','Thanh Hóa','customer','2025-03-11 01:56:48',0),(10,'Lý Thị Huy','lythij@example.com','hashed_password','0976543210','Bắc Giang','customer','2025-03-11 01:56:48',0),(11,'Đặng Văn Kỳ','dangvank@example.com','hashed_password','0965432178','Quảng Ninh','customer','2025-03-11 01:56:48',0),(12,'Tô Thị ','tothil@example.com','hashed_password','0956784321','Hà Nam','customer','2025-03-10 18:56:48',0),(13,'Dương Văn','duongvanm@example.com','hashed_password','0943216785','Nam Định','customer','2025-03-11 01:56:48',0),(14,'Lâm Thị Nụ','lamthin@example.com','hashed_password','0934567891','Thái Nguyên','customer','2025-03-11 01:56:48',0),(15,'Trương Văn Oai','email3@example.com','$2b$10$94cDcHeHwEdf9F1dz9VlBe3f6ONcK45lVx9dOYiZHttQ.yVuyPkoG','0925678341','Phú Thọ','customer','2025-03-11 01:56:48',0),(17,'Kira fusigyy','email@example.com','$2b$10$IUr6h3Jyx7PgYNwgxn4vWurI0m/GeMP.iYpxPMF/SwNfzrFAzO2JO','0344001211','Cổng trường tiểu học Nguyễn Văn Linh - thông Tử Cầu - xã Giai Phamm','customer','2025-03-20 23:43:32',0),(18,'Tuyen Le','email2@example.com','$2b$10$0E1CyWOu/V7wmxwVDzHFDe05n63Gsl6oQ1U85nNcVTwwIyekBR36m','0123456789','Địa chỉ của bạn','admin','2025-03-20 17:56:16',0),(19,'Lê Đức Tuyển','leductuyen099@gmail.com','','0344001211','Cổng trường tiểu học Nguyễn Văn Linh - thông Tử Cầu - xã Giai Pham','customer','2025-03-27 07:08:20',1),(20,'Lê Đức Tuyển','leductuyen099@gmail.com','','0344001211','Cổng trường tiểu học Nguyễn Văn Linh - thông Tử Cầu - xã Giai Pham','customer','2025-04-19 07:13:13',1),(21,'Lê Đức Tuyển','leductuyen098@gmail.com','$2b$10$Kk.E1vWtHHePmX4XdnsKo.6UGQXqCdc1HhRHbwrBuMoOil3sF1cBi','0344001211','Cổng trường tiểu học Nguyễn Văn Linh - thông Tử Cầu - xã Giai Pham','customer','2025-04-20 07:41:22',1),(22,'Lê Đức Tuyển','leductuyen088@gmail.com','$2b$10$Xo.oHx3xFI7Sa5a3Vg0nK.zskey.jj8lOa1n4efQ7nMJPbGWqkSFK','0344001211','Cổng trường tiểu học Nguyễn Văn Linh - thông Tử Cầu - xã Giai Pham','customer','2025-04-20 07:44:03',1),(23,'Son Goku','songoku@gmail.com','$2b$10$iSrzmQhbdu09LsG5JecxvejLevjH.lG43S/hNRB/8bJOWP2HGeqGC','0344003433','thôn tử cầu, xã giai phạm, huyện yên mỹ, tỉnh hưng yên','admin','2025-04-20 17:44:16',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-21  8:38:13
