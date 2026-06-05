-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ptit_borrow
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `chitietdon`
--

DROP TABLE IF EXISTS `chitietdon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietdon` (
  `ma_don_muon` varchar(10) NOT NULL,
  `ma_yeu_cau` varchar(10) DEFAULT NULL,
  `ma_thiet_bi` varchar(10) DEFAULT NULL,
  `so_luong` int NOT NULL,
  `ngay_tra` date DEFAULT NULL,
  `trang_thai` enum('Chưa trả','Đã trả','Quá hạn') DEFAULT 'Chưa trả',
  PRIMARY KEY (`ma_don_muon`),
  KEY `id_donmuon` (`ma_yeu_cau`),
  KEY `id_thietbi` (`ma_thiet_bi`),
  CONSTRAINT `chitietdon_ibfk_1` FOREIGN KEY (`ma_yeu_cau`) REFERENCES `yeucaumuon` (`ma_yeu_cau`),
  CONSTRAINT `chitietdon_ibfk_2` FOREIGN KEY (`ma_thiet_bi`) REFERENCES `thietbi` (`ma_thiet_bi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietdon`
--

LOCK TABLES `chitietdon` WRITE;
/*!40000 ALTER TABLE `chitietdon` DISABLE KEYS */;
INSERT INTO `chitietdon` VALUES ('CTD0001','YCM0001','TB0001',1,'2026-05-04','Đã trả'),('CTD0002','YCM0002','TB0005',1,NULL,'Quá hạn'),('CTD0003','YCM0003','TB0007',1,NULL,'Quá hạn'),('CTD0004','YCM0004','TB0002',1,NULL,'Quá hạn'),('CTD0005','YCM0006','TB0006',2,NULL,'Quá hạn'),('CTD0006','YCM0007','TB0005',1,NULL,'Quá hạn'),('CTD0007','YCM0008','TB0008',1,NULL,'Quá hạn'),('CTD0008','YCM0009','TB0001',1,'2026-05-03','Đã trả'),('CTD0009','YCM0010','TB0004',1,NULL,'Quá hạn'),('CTD0010','YCM0001','TB0002',1,'2026-05-05','Đã trả'),('CTD0011','YCM0011','TB0004',1,NULL,'Chưa trả'),('CTD0012','YCM0004','TB0001',1,NULL,'Quá hạn'),('CTD0013','YCM0012','TB0001',1,NULL,'Chưa trả'),('CTD0014','YCM0013','TB0002',1,NULL,'Chưa trả'),('CTD0015','YCM0014','TB0010',1,NULL,'Chưa trả');
/*!40000 ALTER TABLE `chitietdon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danhmuc`
--

DROP TABLE IF EXISTS `danhmuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danhmuc` (
  `ma_danh_muc` varchar(10) NOT NULL,
  `ten_danh_muc` varchar(255) NOT NULL,
  `mo_ta` text,
  `trang_thai` varchar(50) NOT NULL DEFAULT 'hoat-dong',
  PRIMARY KEY (`ma_danh_muc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhmuc`
--

LOCK TABLES `danhmuc` WRITE;
/*!40000 ALTER TABLE `danhmuc` DISABLE KEYS */;
INSERT INTO `danhmuc` VALUES ('DM0001','Thiết bị Điện tử và Trình chiếu','Máy chiếu, màn chiếu, thiết bị kết nối và nguồn điện hỗ trợ hội thảo, trình chiếu.','hoat-dong'),('DM0002','Thiết bị Truyền thông và Ghi hình','Máy ảnh, chân quay, thiết bị chống rung và bộ đàm phục vụ truyền thông sự kiện.','hoat-dong'),('DM0003','Thiết bị Âm thanh và Ánh sáng','Hệ thống loa kéo, micro, đèn trợ sáng phục vụ văn nghệ và thông báo.','hoat-dong'),('DM0004','Dụng cụ Tổ chức Ngoại khóa','Lều trại, bạt sinh hoạt, dây kéo co và các dụng cụ hoạt động ngoài trời.','hoat-dong'),('DM0005','Vật dụng Hậu cần và Hỗ trợ','Bảng từ, hộp y tế, súng bắn keo và thùng lưu trữ phục vụ ban tổ chức.','hoat-dong');
/*!40000 ALTER TABLE `danhmuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thietbi`
--

DROP TABLE IF EXISTS `thietbi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thietbi` (
  `ma_thiet_bi` varchar(10) NOT NULL,
  `ten_thiet_bi` varchar(255) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `mo_ta` text,
  `tong_so_luong` int DEFAULT '0',
  `so_luong_da_cho_muon` int DEFAULT '0',
  `so_luong_con_lai` int GENERATED ALWAYS AS ((`tong_so_luong` - `so_luong_da_cho_muon`)) STORED,
  `ma_danh_muc` varchar(10) DEFAULT NULL,
  `tinh_trang` enum('sẵn hàng','hết','bảo trì') DEFAULT 'sẵn hàng',
  PRIMARY KEY (`ma_thiet_bi`),
  KEY `id_danhmuc` (`ma_danh_muc`),
  CONSTRAINT `thietbi_ibfk_1` FOREIGN KEY (`ma_danh_muc`) REFERENCES `danhmuc` (`ma_danh_muc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thietbi`
--

LOCK TABLES `thietbi` WRITE;
/*!40000 ALTER TABLE `thietbi` DISABLE KEYS */;
INSERT INTO `thietbi` (`ma_thiet_bi`, `ten_thiet_bi`, `hinh_anh`, `mo_ta`, `tong_so_luong`, `so_luong_da_cho_muon`, `ma_danh_muc`, `tinh_trang`) VALUES ('TB0001','Máy chiếu di động','https://i.pinimg.com/736x/70/f2/db/70f2dbe28a9223b931422dff556cd835.jpg','Độ phân giải Full HD, độ sáng 3000 lumens, hỗ trợ kết nối HDMI/Wireless',5,0,'DM0001','sẵn hàng'),('TB0002','Màn chiếu có chân đế','https://i.pinimg.com/736x/07/1b/ca/071bca7509157e6f087f177df776167e.jpg','Kích thước 100 inch, chân đế 3 càng di động vững chắc, dễ gập gọn',5,0,'DM0001','sẵn hàng'),('TB0003','Dây cáp kết nối (HDMI, Type-C, VGA)','https://i.pinimg.com/1200x/f4/2c/24/f42c242fdcf6471174f4c5a239809a5e.jpg','Bộ dây cáp chuyển đổi đa năng truyền tín hiệu dài 3m ổn định',15,0,'DM0001','sẵn hàng'),('TB0004','Ổ cắm điện kéo dài','https://i.pinimg.com/736x/2a/b3/6f/2ab36f62235cece0054dc873470155ff.jpg','Ổ cắm 6 lỗ dây dài 5m, chịu tải tối đa 3300W có công tắc an toàn',12,3,'DM0001','sẵn hàng'),('TB0005','Máy ảnh kỹ thuật số','https://i.pinimg.com/1200x/c7/d2/6c/c7d26cd5c4bb1ef46a2cc50934e8bc15.jpg','Dòng máy ảnh Mirrorless kèm lens kit, hỗ trợ quay phim sự kiện 4K',3,2,'DM0002','sẵn hàng'),('TB0006','Chân máy ảnh (Tripod)','https://i.pinimg.com/1200x/50/e6/dc/50e6dc900baf25fc8d09f67f484bdf14.jpg','Chất liệu hợp kim nhôm gọn nhẹ, cao tối đa 1.6m, kèm túi đựng',6,2,'DM0002','sẵn hàng'),('TB0007','Gimbal chống rung cho điện thoại/máy ảnh','https://i.pinimg.com/736x/c6/08/3b/c6083bf6c29c194c1cf4e2559e5c2bda.jpg','Thiết bị chống rung điện tử 3 trục giúp mượt mà khung hình quay',4,2,'DM0002','sẵn hàng'),('TB0008','Bộ đàm liên lạc','https://i.pinimg.com/736x/a6/b7/b0/a6b7b0b8a545ef44e02d6ece8b274e1f.jpg','Tần số UHF chuyên dụng, âm thanh rõ nét, cự ly hoạt động 1-2km',16,0,'DM0002','sẵn hàng'),('TB0009','Loa kéo di động','https://i.pinimg.com/736x/1e/94/78/1e9478166a4e340a7e8bba21a28cfdfe.jpg','Công suất lớn 400W, tích hợp Bluetooth, kèm 2 micro không dây bọc da',4,0,'DM0003','sẵn hàng'),('TB0010','Micro không dây','https://i.pinimg.com/736x/37/90/a8/3790a8b16e37136c18dad00865670820.jpg','Cặp micro cầm tay tần số UHF chống nhiễu, khoảng cách bắt sóng 30m',8,2,'DM0003','sẵn hàng'),('TB0011','Đèn trợ sáng','https://i.pinimg.com/736x/6e/a5/0a/6ea50a7c1a781c2177cce76b5393bc33.jpg','Đèn LED dạng vòng Ring Light công suất 60W, điều chỉnh được nhiệt độ màu',6,0,'DM0003','sẵn hàng'),('TB0012','Loa cầm tay','https://i.pinimg.com/1200x/d8/69/e0/d869e00f066bd2bfec7f39cc6c38af30.jpg','Loa megaphone thông báo cầm tay công suất 25W, tích hợp còi hú khẩn cấp',5,0,'DM0003','sẵn hàng'),('TB0013','Lều trại','https://i.pinimg.com/1200x/6b/97/a4/6b97a40022ef6d45e54c950bab5bb53a.jpg','Lều tự bung dành cho 4-6 người, chống thấm nước tuyệt đối, lớp lưới thoáng khí',10,0,'DM0004','sẵn hàng'),('TB0014','Dây thừng kéo co','https://i.pinimg.com/736x/54/d7/20/54d720c89c725d0a2f8d27d792ac034a.jpg','Sợi đay tự nhiên bện chặt bám tay, đường kính 3cm, chiều dài tiêu chuẩn 20m',3,0,'DM0004','sẵn hàng'),('TB0015','Thùng giữ nhiệt cỡ lớn','https://i.pinimg.com/736x/b7/c4/1c/b7c41cf6a0e7a8765083c0826daabe06.jpg','Dung tích 45L giữ nhiệt bằng foam dày, cấu tạo có bánh xe kéo tiện lợi',4,0,'DM0004','sẵn hàng'),('TB0016','Bạt trải ngồi sinh hoạt','https://i.pinimg.com/1200x/13/f0/b7/13f0b77967e7fa8b108a4b0890b6126f.jpg','Bạt nhựa dứa sọc kích thước lớn 4x6m chống thấm, thích hợp trải cỏ',12,0,'DM0004','sẵn hàng'),('TB0017','Bảng từ','https://i.pinimg.com/736x/25/cb/b3/25cbb35f9b9b1a89a554c3424b1dc823.jpg','Bảng từ trắng viết bút dạ kích thước 90x120cm, khung chân có bánh xe khóa',3,0,'DM0005','sẵn hàng'),('TB0018','Hộp sơ cứu y tế','https://i.pinimg.com/1200x/7d/7e/09/7d7e091e45bf9e108be41fafd3728bf2.jpg','Hộp nhựa đựng đầy đủ bông, băng gạc, cồn đỏ, panh, thuốc hạ sốt cơ bản',6,0,'DM0005','sẵn hàng'),('TB0019','Súng bắn keo công nghiệp','https://i.pinimg.com/1200x/69/a1/8a/69a18a74a4d080618e02f7f797c40e5d.jpg','Công suất lớn 100W nóng nhanh, sử dụng keo nến kích thước lớn 11mm',8,0,'DM0005','sẵn hàng'),('TB0020','Thùng nhựa đựng đồ có bánh xe','https://i.pinimg.com/1200x/2a/6d/0f/2a6d0fe425c8a8d421090fc7881d9b4c.jpg','Thùng nhựa PP nguyên sinh dung tích 60L chắc chắn, bảo quản đồ mang đi xa',15,0,'DM0005','sẵn hàng');
/*!40000 ALTER TABLE `thietbi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thongbao`
--

DROP TABLE IF EXISTS `thongbao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thongbao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) DEFAULT NULL,
  `noi_dung` text,
  `ngay` datetime DEFAULT CURRENT_TIMESTAMP,
  `nguoinhan_id` varchar(20) DEFAULT NULL,
  `loai` enum('duyệt','từ chối','nhắc đến hạn','nhắc quá hạn') DEFAULT NULL,
  `trang_thai` enum('chua_doc','da_doc') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nguoinhan_id` (`nguoinhan_id`),
  CONSTRAINT `thongbao_ibfk_1` FOREIGN KEY (`nguoinhan_id`) REFERENCES `users` (`ma_sv`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thongbao`
--

LOCK TABLES `thongbao` WRITE;
/*!40000 ALTER TABLE `thongbao` DISABLE KEYS */;
INSERT INTO `thongbao` VALUES (1,'Đã duyệt đơn','Đơn mượn YCM0001 của bạn đã thành công.','2026-05-10 23:33:12','B24DCCN001','duyệt','da_doc'),(2,'Nhắc trả hàng','Thiết bị tại đơn YCM0002 sắp đến hạn.','2026-05-10 23:33:12','B24DCCN002','nhắc đến hạn','chua_doc'),(3,'YC bị từ chối','Lý do: Mục đích sử dụng không hợp lệ đối với đơn YCM0005.','2026-05-10 23:33:12','B24DCCN005','từ chối','chua_doc'),(4,'Quá hạn trả','Bạn quá hạn 4 ngày tại đơn YCM0002.','2026-05-10 23:33:12','B24DCCN002','nhắc quá hạn','chua_doc'),(5,'Yêu cầu mới','Có đơn chờ xử lý từ B24DCCN004 (YCM0004).','2026-05-10 23:33:12','AD0001','duyệt','da_doc'),(6,'Trả hàng xong','Hệ thống đã nhận lại máy tại đơn YCM0009.','2026-05-10 23:33:12','B24DCCN009','duyệt','chua_doc'),(7,'Cảnh báo sắp hạn','Sắp đến hạn trả Ổ cắm điện tại đơn YCM0010.','2026-05-10 23:33:12','B24DCCN001','nhắc đến hạn','da_doc'),(8,'Thông báo duyệt','Yêu cầu YCM0006 đã được thông qua.','2026-05-10 23:33:12','B24DCCN006','duyệt','chua_doc'),(9,'Nhắc nhở','Hạn trả Bộ đàm là ngày 13/05/2026 nhé.','2026-05-10 23:33:12','B24DCCN008','nhắc đến hạn','chua_doc'),(10,'Đơn chờ duyệt','Bạn còn đơn mượn YCM0008 chưa xử lý.','2026-05-10 23:33:12','AD0001','duyệt','da_doc'),(11,'Yêu cầu mới','Có đơn chờ xử lý từ B24DCCN001 (YCM0013).','2026-05-31 15:58:46','AD0001','duyệt','da_doc'),(12,'Yêu cầu mới','Có đơn chờ xử lý từ B24DCCN001 (YCM0014).','2026-05-31 16:29:35','AD0001','duyệt','da_doc'),(13,'Đã duyệt đơn','Đơn mượn YCM0014 của bạn đã được duyệt thành công.','2026-05-31 16:31:13','B24DCCN001','duyệt','da_doc'),(14,'Đã duyệt đơn','Đơn mượn YCM0003 của bạn đã được duyệt thành công.','2026-05-31 17:21:41','B24DCCN003','duyệt','da_doc');
/*!40000 ALTER TABLE `thongbao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ma_sv` varchar(20) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `so_phone` varchar(15) DEFAULT NULL,
  `vai_tro` enum('admin','user') DEFAULT 'user',
  PRIMARY KEY (`ma_sv`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('AD0001','Admin','admin@ptit.vn','$2b$10$9iThNHyjveCSwkTpjIMMAOWJifqAZ7tRrIktt/cyzcoHnhnevzSyS','0912345678','admin'),('B24DCCN001','Giáp Văn Hiếu','hieu@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0386714191','user'),('B24DCCN002','Trần Thị Bình','binh@student.vn','$2b$10$PvrvZfQnH4FOe3ee0azi4.VDwQa3CF.zX13JGC8KF5sKz1Dzv0dBy','0923456782','user'),('B24DCCN003','Lê Văn Cường','cuong@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0923456783','user'),('B24DCCN004','Phạm Minh Đức','duc@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0923456784','user'),('B24DCCN005','Đặng Thu Hà','ha@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0923456785','user'),('B24DCCN006','Hoàng Văn Hải','hai@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0923456786','user'),('B24DCCN007','Vũ Thị Lan','lan@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0923456787','user'),('B24DCCN008','Ngô Quốc Nam','nam@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0923456788','user'),('B24DCCN009','Đỗ Minh Phương','phuong@student.vn','$2b$10$bLKDcj85/ZIQdkKda0hfpOkgH9xEHtmVJTHeRv4.kzTnl8DFjBnti','0923456789','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeucaumuon`
--

DROP TABLE IF EXISTS `yeucaumuon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yeucaumuon` (
  `ma_yeu_cau` varchar(10) NOT NULL,
  `ma_nguoi_muon` varchar(20) DEFAULT NULL,
  `ma_nguoi_duyet` varchar(20) DEFAULT NULL,
  `ngay_muon` date DEFAULT NULL,
  `ngay_tra_du_kien` date DEFAULT NULL,
  `ngay_duyet` date DEFAULT NULL,
  `ly_do_muon` text,
  `ly_do_tu_choi` text,
  `trang_thai` enum('Chờ duyệt','Đang mượn','Hoàn thành','Bị từ chối') DEFAULT 'Chờ duyệt',
  PRIMARY KEY (`ma_yeu_cau`),
  KEY `nguoi_muon_id` (`ma_nguoi_muon`),
  KEY `nguoi_duyet_id` (`ma_nguoi_duyet`),
  CONSTRAINT `yeucaumuon_ibfk_1` FOREIGN KEY (`ma_nguoi_muon`) REFERENCES `users` (`ma_sv`),
  CONSTRAINT `yeucaumuon_ibfk_2` FOREIGN KEY (`ma_nguoi_duyet`) REFERENCES `users` (`ma_sv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yeucaumuon`
--

LOCK TABLES `yeucaumuon` WRITE;
/*!40000 ALTER TABLE `yeucaumuon` DISABLE KEYS */;
INSERT INTO `yeucaumuon` VALUES ('YCM0001','B24DCCN001','AD0001','2026-05-01','2026-05-05','2026-05-01','Tổ chức hội thảo chuyên đề khoa',NULL,'Hoàn thành'),('YCM0002','B24DCCN002','AD0001','2026-05-02','2026-05-06','2026-05-02','Quay video truyền thông sự kiện',NULL,'Đang mượn'),('YCM0003','B24DCCN003',NULL,'2026-05-10','2026-05-12','2026-05-31','Hỗ trợ quay vlog ngoại khóa',NULL,'Đang mượn'),('YCM0004','B24DCCN004',NULL,'2026-05-10','2026-05-15',NULL,'Trình chiếu hoạt động ngoài trời',NULL,'Chờ duyệt'),('YCM0005','B24DCCN005','AD0001','2026-05-05','2026-05-07','2026-05-05','Việc cá nhân','Thiết bị không dùng cho mục đích cá nhân ngoài phạm vi học tập','Bị từ chối'),('YCM0006','B24DCCN006','AD0001','2026-05-08','2026-05-12','2026-05-08','Setup góc quay cố định cho talkshow',NULL,'Đang mượn'),('YCM0007','B24DCCN007','AD0001','2026-05-09','2026-05-11','2026-05-09','Chụp ảnh kỷ yếu câu lạc bộ',NULL,'Đang mượn'),('YCM0008','B24DCCN008',NULL,'2026-05-10','2026-05-13','2026-05-31','Điều phối viên sự kiện chào tân sinh viên','Ai???','Bị từ chối'),('YCM0009','B24DCCN009','AD0001','2026-05-01','2026-05-03','2026-05-01','Chiếu phim sinh hoạt chi đoàn',NULL,'Hoàn thành'),('YCM0010','B24DCCN001','AD0001','2026-05-10','2026-05-14','2026-05-10','Hỗ trợ kỹ thuật sự kiện khoa',NULL,'Đang mượn'),('YCM0011','B24DCCN001',NULL,'2026-05-25','2026-05-31','2026-05-29','Mượn thiết bị điện cho ban tổ chức',NULL,'Đang mượn'),('YCM0012','B24DCCN001',NULL,'2026-05-31','2026-06-01','2026-05-31','CHiếu xem phim',NULL,'Đang mượn'),('YCM0013','B24DCCN001',NULL,'2026-05-31','2026-06-01','2026-05-31','Mượn xem phim',NULL,'Đang mượn'),('YCM0014','B24DCCN001',NULL,'2026-05-31','2026-06-01','2026-05-31','Hát karaoke',NULL,'Đang mượn');
/*!40000 ALTER TABLE `yeucaumuon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ptit_borrow'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-31 17:32:18
